/* eslint-disable no-underscore-dangle */
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import {
  head,
  toUpper,
  pathOr,
  path,
  props,
  filter,
  compose,
  evolve,
  map,
  assoc,
  pick,
  splitAt,
  split,
  last,
  toLower,
  findIndex,
  test
} from 'ramda'
const { RateLimiterMongo } = require('rate-limiter-flexible')
import User from '../models/user'
import { APIError } from '../helpers/'
import { getConfigPromise } from '../config/getConfigs'
import { transformRoutesByRole } from '../transforms/frontend-routes'
import { store } from '../index'

const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const getFullName = ({ firstName, lastName }) =>
  firstName && lastName ? `${firstName} ${lastName}` : 'Hello'
const getInitials = ({ firstName, lastName }) =>
  firstName && lastName
    ? `${toUpper(head(firstName))}${toUpper(head(lastName))}`
    : ''

const setupProfileInfo = (user, req) => {
  const profile = {
    name: {
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: getFullName(user),
      initials: getInitials(user)
    },
    email: user.emails,
    addresses: user.addresses || [],
    phoneNumbers: user.phoneNumbers
  }
  req.session.user.profile = profile
  return profile
}

const setupSessionUser = (user, userRoutes, req) => {
  const sessionUser = {
    id: user._id,
    isAuth: true,
    routes: transformRoutesByRole(user.role, userRoutes),
    role: user.role
  }
  req.session.user = sessionUser
  setupProfileInfo(user, req)
  return pick(['isAuth', 'routes'], sessionUser)
}

const validateUser = async (req, res, next) => {
  const email = pathOr('', ['body', 'email'], req)
  const phoneNumber = pathOr('', ['body', 'phone'], req)

  try {
    const [tempEmailBlockList, foundUser] = await Promise.all([
      getConfigPromise('tempEmailBlockList'),
      User.findOne({
        $or: [{ 'emails.email': email }, { 'phoneNumbers.phone': phoneNumber }]
      })
    ])
    if (foundUser) {
      res.json({ isValidUser: false })
    } else if (email !== '') {
      const domain = toLower(last(split('@', email)))
      const isOnBlockList =
        filter(x => x === domain, tempEmailBlockList).length > 0

      if (isOnBlockList) {
        res.json({
          isValidUser: false,
          message:
            'Temporary email accounts are not allowed. Please enter a valid email.'
        })
      } else {
        res.json({ isValidUser: true })
      }
    } else {
      res.json({ isValidUser: true })
    }
    return foundUser
  } catch (error) {}
}

const register = async (req, res, next) => {
  try {
    const [routes, foundUser] = await Promise.all([
      getConfigPromise('frontend-routes'),
      User.findOne({ emails: { $elemMatch: { email: req.body.user } } })
    ])

    if (foundUser !== null) {
      const err = new APIError('User already exists', httpStatus.CONFLICT, true)
      return next(err)
    }

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumbers: [
        {
          phone: req.body.phone,
          phoneData: req.body.phoneData,
          phoneFormatted: req.body.phoneFormatted
        }
      ],
      emails: [
        {
          email: req.body.email
        }
      ],
      password: req.body.password
    })

    const savedUser = await user.save()

    if (!savedUser || !savedUser._id) {
      const err = new APIError('Issue saving user', httpStatus.CONFLICT, true)
      return next(err)
    }

    const returnObj = setupSessionUser(savedUser, routes, req)

    res.json(returnObj)
    return savedUser
  } catch (error) {
    const err = new APIError(
      `Internal Server Error ${error}`,
      httpStatus.INTERNAL_SERVER_ERROR
    )
    next(err)
  }
}

const maxWrongAttemptsByIPperDay = 100
const maxConsecutiveFailsByUsernameAndIP = 10

const getUsernameIPkey = (username, ip) => `${username}_${ip}`

const login = async (req, res, next) => {
  const client = await store.clientP

  const limiterSlowBruteByIP = new RateLimiterMongo({
    storeClient: client,
    keyPrefix: 'login_fail_ip_per_day',
    points: maxWrongAttemptsByIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24 // Block for 1 day, if 100 wrong attempts per day
  })

  const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
    storeClient: client,
    keyPrefix: 'login_fail_consecutive_username_and_ip',
    points: maxConsecutiveFailsByUsernameAndIP,
    duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
    blockDuration: 60 * 60 // Block for 1 hour
  })

  const ipAddr = req.ip
  const usernameIPkey = getUsernameIPkey(req.body.user, ipAddr)

  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    limiterSlowBruteByIP.get(ipAddr)
  ])

  let retrySecs = 0

  // Check if IP or Username + IP is already blocked
  if (
    resSlowByIP !== null &&
    resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
  ) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1
  } else if (
    resUsernameAndIP !== null &&
    resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
  ) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1
  }

  if (retrySecs > 0) {
    const err = new APIError(
      `Too Many Requests. Retry after ${String(retrySecs)}`,
      429,
      true
    )

    return next(err)
  } else {
    try {
      const [routes, user] = await Promise.all([
        getConfigPromise('frontend-routes'),
        User.findOne(
          {
            $or: [
              { 'emails.email': req.body.user, 'emails.primaryEmail': true },
              {
                'phoneNumbers.phone': req.body.user,
                'phoneNumbers.primaryPhone': true
              }
            ]
          },
          '+password'
        )
      ])

      const isMatch =
        user !== null
          ? await bcrypt.compare(req.body.password, user.password)
          : false

      if (!isMatch) {
        // Consume 1 point from limiters on wrong attempt and block if limits reached
        try {
          const promises = [limiterSlowBruteByIP.consume(ipAddr)]
          if (user !== null) {
            // Count failed attempts by Username + IP only for registered users
            promises.push(
              limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey)
            )
          }

          await Promise.all(promises)

          const err = new APIError(
            'Incorrect Login Information',
            httpStatus.UNAUTHORIZED,
            true
          )

          return next(err)
        } catch (rlRejected) {
          if (rlRejected instanceof Error) {
            throw rlRejected
          } else {
            const err = new APIError(
              `Too Many Requests. Retry After ${String(
                Math.round(rlRejected.msBeforeNext / 1000)
              ) || 1}`,
              429,
              true
            )

            return next(err)
          }
        }
      }

      if (isMatch) {
        if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
          // Reset on successful authorisation
          await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey)
        }

        const returnObj = setupSessionUser(user, routes, req)
        res.json(returnObj)
        return returnObj
      }
    } catch (error) {
      const err = new APIError(
        `Internal Server Error ${error}`,
        httpStatus.INTERNAL_SERVER_ERROR
      )
      next(err)
    }
  }
}

const logout = (req, res, next) => {
  req.session.destroy(e => {
    if (e) {
      const err = new APIError(
        `Error while logging out ${e}`,
        httpStatus.INTERNAL_SERVER_ERROR
      )
      next(err)
    }
    res.json({ success: true })
  })
  return
}

const SignJWT = id =>
  jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: '20m' })

const forgotPassword = async (req, res, next) => {
  console.log('TEST----------------------')
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  try {
    const foundUser = await User.findOne({ email: req.body.email })
    if (!foundUser) {
      const err = new APIError(
        'Incorrect Login Information',
        httpStatus.UNAUTHORIZED,
        false
      )
      return next(err)
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: foundUser._id },
      { $set: { resetToken: SignJWT(foundUser._id) } },
      { new: true, useFindAndModify: false }
    )
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: updatedUser.email,
      subject: 'Password reset link for Zenerprise',
      html: `
      <h2>Please click on the link below to reset your password for your account at Zenerprise<h2>
      <h3>If you did NOT make this password change request then please disregard this email.<h3>
      <a href="http://localhost:3000/reset-password?token=${updatedUser.resetToken}">Reset Link</a> 
    `
    } //TODO: REPLACE THIS CONFIG CLIENT URL

    const response = await transporter.sendMail(mailOptions)
    res.json({ success: true })
    return response
  } catch (error) {
    next(error)
  }
}

const updateName = async (req, res, next) => {
  const userId = pathOr(null, ['session', 'user', 'id'], req)
  const sessionRoutes = path(['session', 'user', 'routes'], req)
  try {
    const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true
    })

    const returnObj = setupProfileInfo(user, req)
    return res.json(returnObj)
  } catch (error) {
    next(error)
  }
}

const updateAddress = async (req, res, next) => {
  const userId = pathOr(null, ['session', 'user', 'id'], req)
  const sessionRoutes = path(['session', 'user', 'routes'], req)
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { addresses: [req.body] },
      { new: true }
    )
    const returnObj = setupSessionUser(user, sessionRoutes, req)
    return res.json(returnObj)
  } catch (error) {
    next(error)
  }
}

function updateEmail(req, res, next) {
  const userId = pathOr(null, ['session', 'userId'], req)
  console.log(req.body)
  // const backupEmails = compose(evolve({
  //   emails: compose(
  //     map(email => assoc('primaryEmail', false, email)),
  //     filter((email) => !email.primaryEmail)
  //   )
  // }))(req.body)
  // console.log('---------------->', backupEmails)

  User.findOne({ 'emails.email': email })
    .then(foundUsers => {
      console.log('----------------->', foundUsers)
      res.json({ test: 'passed' })
    })
    .catch(e => next(e))

  // User.findOneAndUpdate({ _id: userId }, backupEmails, { new: true })
  //   .then(user => {
  //     console.log(user)
  //     const returnObj = setupSessionUser(user, req.session.userRoutes)
  //     return res.json(returnObj)
  //   })
  //   .catch(e => next(e))
}

const addEmail = async (req, res, next) => {
  const userId = pathOr(null, ['session', 'user', 'id'], req)
  const newEmail = path(['body', 'emails', 0, 'email'], req)
  const sessionRoutes = path(['session', 'user', 'routes'], req)
  try {
    const foundUser = await User.findOne({ 'emails.email': newEmail })
    if (foundUser !== null) {
      const err = new APIError('User already exists', httpStatus.CONFLICT, true)
      next(err)
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { emails: { email: newEmail, primaryEmail: false } } },
      { new: true }
    )
    const returnObj = setupSessionUser(user, sessionRoutes, req)
    return res.json(returnObj)
  } catch (error) {
    const err = new APIError(
      `Internal Server Error ${error}`,
      httpStatus.INTERNAL_SERVER_ERROR
    )
    next(err)
  }
}

const updatePrimaryPhone = async (req, res, next) => {
  const sessionRoutes = path(['session', 'user', 'routes'], req)
  const userId = pathOr(null, ['session', 'user', 'id'], req)
  const [type, phone, phoneFormatted, phoneData, phoneId] = props(
    ['type', 'phone', 'phoneFormatted', 'phoneData', '_id'],
    req.body
  )
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        phoneNumbers: {
          $elemMatch: {
            _id: phoneId,
            primaryPhone: true
          }
        }
      },
      {
        $set: {
          'phoneNumbers.$.type': type,
          'phoneNumbers.$.phone': phone,
          'phoneNumbers.$.phoneFormatted': phoneFormatted,
          'phoneNumbers.$.phoneData': phoneData
        }
      },
      { new: true }
    )
    const returnObj = setupSessionUser(user, sessionRoutes, req)
    return res.json(returnObj)
  } catch (error) {
    next(error)
  }
}

const updatePassword = async (req, res, next) => {
  const sessionRoutes = path(['session', 'user', 'routes'], req)
  const userId = pathOr(null, ['session', 'user', 'id'], req)
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.password
  try {
    const user = await User.findOne({ _id: userId }, '+password')
    //Compare the user inputted old password against stored one
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      const err = new APIError(
        'Incorrect Login Information',
        httpStatus.UNAUTHORIZED,
        false
      )
      return next(err)
    }
    const updatedUser = await user.save()
    const returnObj = setupSessionUser(updatedUser, sessionRoutes, req)
    return res.json(returnObj)
  } catch (error) {
    next(error)
  }
}

const userProfile = async (req, res, next) => {
  const profile = pathOr(null, ['session', 'user', 'profile'], req)
  return res.json(profile)
}

export default {
  register,
  login,
  logout,
  forgotPassword,
  updateName,
  updateAddress,
  updateEmail,
  updatePrimaryPhone,
  updatePassword,
  validateUser,
  addEmail,
  userProfile
}
