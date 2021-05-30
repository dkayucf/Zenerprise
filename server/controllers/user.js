/* eslint-disable no-underscore-dangle */
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import { head, toUpper, pathOr, path, props } from 'ramda'
import User from '../models/user'
import APIError from '../helpers/APIError'
import { getConfigPromise } from '../config/getConfigs'
import { transformRoutesByRole } from '../transforms/frontend-routes'

const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const getFullName = ({ firstName, lastName }) =>
  firstName && lastName ? `${firstName} ${lastName}` : 'Hello'
const getInitials = ({ firstName, lastName }) =>
  firstName && lastName
    ? `${toUpper(head(firstName))}${toUpper(head(lastName))}`
    : ''

const setReturnObject = (user, userRoutes) => {
  return {
    user: {
      id: user._id,
      name: {
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: getFullName(user)
      },
      initials: getInitials(user),
      email: user.emails,
      addresses: user.addresses || [],
      phoneNumbers: user.phoneNumbers
    },
    isAuth: true,
    routes: transformRoutesByRole(user.role, userRoutes)
  }
}

function validateUser(req, res, next) {
  const email = pathOr('', ['body', 'email'], req)
  const phoneNumber = pathOr('', ['body', 'phone'], req)

  User.findOne({
    $or: [{ 'emails.email': email }, { 'phoneNumbers.phone': phoneNumber }]
  })
    .then(foundUser => {
      if (foundUser) {
        res.json({ isValidUser: false })
      } else {
        res.json({ isValidUser: true })
      }
      return foundUser
    })
    .catch(e => {
      const err = new APIError(
        `Internal Server Error ${e}`,
        httpStatus.INTERNAL_SERVER_ERROR
      )
      next(err)
    })
}

function register(req, res, next) {
  Promise.all([
    getConfigPromise('frontend-routes'),
    User.findOneAsync({ email: req.body.email })
  ])
    .then(([routes, foundUser]) => {
      if (foundUser !== null) {
        const err = new APIError(
          'User already exists',
          httpStatus.CONFLICT,
          true
        )

        throw err
      }
      req.session.userRoutes = routes
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

      return user.saveAsync()
    })
    .then(savedUser => {
      req.session.userId = savedUser._id
      req.session.isAuth = true
      req.session.userRole = savedUser.role

      const returnObj = setReturnObject(savedUser, req.session.userRoutes)
      res.json(returnObj)
      return savedUser
    })
    .catch(e => {
      const err = new APIError(
        `Internal Server Error ${e}`,
        httpStatus.INTERNAL_SERVER_ERROR
      )
      next(err)
    })
}

function login(req, res, next) {
  Promise.all([
    getConfigPromise('frontend-routes'),
    User.findOneAsync(
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
    .then(([routes, user]) => {
      if (!user) {
        const err = new APIError(
          'Incorrect Login Information',
          httpStatus.UNAUTHORIZED,
          false
        )
        return next(err)
      }
      req.routes = routes
      req.user = user

      return bcrypt.compare(req.body.password, user.password)
    })
    .then(isMatch => {
      if (!isMatch) {
        const err = new APIError(
          'Incorrect Login Information',
          httpStatus.UNAUTHORIZED,
          false
        )
        return next(err)
      }

      req.session.userId = req.user._id
      req.session.isAuth = true
      req.session.userRoutes = req.routes
      req.session.userRole = req.user.role

      const returnObj = setReturnObject(req.user, req.routes)
      return res.json(returnObj)
    })
    .catch(e => {
      const err = new APIError(
        `Internal Server Error ${e}`,
        httpStatus.INTERNAL_SERVER_ERROR
      )
      next(err)
    })
}

function logout(req, res, next) {
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
}

const SignJWT = id =>
  jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: '20m' })

function forgotPassword(req, res, next) {
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

  User.findOne({ email: req.body.email })
    .then(foundUser => {
      if (!foundUser) {
        return res
          .status(400)
          .json({ message: 'User with this email does not exist.' })
      }
      return User.findOneAndUpdate(
        { _id: foundUser._id },
        { $set: { resetToken: SignJWT(foundUser._id) } },
        { new: true, useFindAndModify: false }
      )
    })
    .then(updatedUser => {
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
      return transporter.sendMail(mailOptions)
    })
    .then(response => {
      res.json({ success: true })
      return response
    })
    .catch(e => next(e))
}

function updateName(req, res, next) {
  const userId = pathOr(null, ['session', 'userId'], req)

  return User.findOneAndUpdate({ _id: userId }, req.body, { new: true })
    .then(user => {
      const returnObj = setReturnObject(user, req.session.userRoutes)
      return res.json(returnObj)
    })
    .catch(e => next(e))
}

function updateAddress(req, res, next) {
  const userId = pathOr(null, ['session', 'userId'], req)

  return User.findOneAndUpdate(
    { _id: userId },
    { addresses: [req.body] },
    { new: true }
  )
    .then(user => {
      const returnObj = setReturnObject(user, req.session.userRoutes)
      return res.json(returnObj)
    })
    .catch(e => next(e))
}

function updateEmail(req, res, next) {
  const userId = pathOr(null, ['session', 'userId'], req)

  return User.findOneAndUpdate({ _id: userId }, req.body, { new: true })
    .then(user => {
      const returnObj = setReturnObject(user, req.session.userRoutes)
      return res.json(returnObj)
    })
    .catch(e => next(e))
}

function updatePrimaryPhone(req, res, next) {
  const userId = pathOr(null, ['session', 'userId'], req)

  const emailId = path(['body', '_id'], req)
  const [type, phone, phoneFormatted, phoneData] = props(
    ['type', 'phone', 'phoneFormatted', 'phoneData'],
    req.body
  )
  return User.findOneAndUpdate(
    {
      _id: userId,
      phoneNumbers: {
        $elemMatch: {
          _id: emailId,
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
    .then(user => {
      const returnObj = setReturnObject(user, req.session.userRoutes)
      return res.json(returnObj)
    })
    .catch(e => next(e))
}

function updatePassword(req, res, next) {
  const userId = pathOr(null, ['session', 'userId'], req)

  const oldPassword = req.body.oldPassword
  const newPassword = req.body.password

  User.findOneAsync({ _id: userId }, '+password')
    .then(user => {
      req.user = user
      return bcrypt.compare(oldPassword, user.password)
    })
    .then(isMatch => {
      if (!isMatch) {
        const err = new APIError(
          'Incorrect Login Information',
          httpStatus.UNAUTHORIZED,
          false
        )
        return next(err)
      }

      req.user.password = newPassword
      return req.user.saveAsync()
    })
    .then(updatedUser => {
      const returnObj = setReturnObject(updatedUser, req.session.userRoutes)
      return res.json(returnObj)
    })
    .catch(e => next(e))
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
  validateUser
}
