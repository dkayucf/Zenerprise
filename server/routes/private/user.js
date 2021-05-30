import express from 'express'
import validate from 'express-validation'
import userParamValidation from './param-validation/user'
import userCtrl from '../../controllers/user'
import APIError from '../../helpers/APIError'
import { pathOr } from 'ramda'

const router = express.Router() // eslint-disable-line new-cap

const checkUserId = (req, res, next) => {
  const userId = pathOr(null, ['session', 'userId'], req)

  if (!userId) {
    const err = new APIError(
      'Incorrect Login Information',
      httpStatus.UNAUTHORIZED,
      false
    )
    return next(err)
  }
  next()
}

/** PUT /apix/users/name  */
router
  .route('/name')
  .put(
    checkUserId,
    validate(userParamValidation.updateName, {}, { stripUnknown: true }),
    userCtrl.updateName
  )

/** PUT /apix/users/address  */
router
  .route('/address')
  .put(
    checkUserId,
    validate(userParamValidation.updateAddress, {}, { stripUnknown: true }),
    userCtrl.updateAddress
  )

/** PUT /apix/users/email  */
router
  .route('/email')
  .put(
    checkUserId,
    validate(userParamValidation.updateEmail, {}, { stripUnknown: true }),
    userCtrl.updateEmail
  )

/** PUT /apix/users/primary-phone  */
router
  .route('/primary-phone')
  .put(
    checkUserId,
    validate(
      userParamValidation.updatePrimaryPhone,
      {},
      { stripUnknown: true }
    ),
    userCtrl.updatePrimaryPhone
  )

/** PUT /apix/users/update-password  */
router
  .route('/update-password')
  .put(
    checkUserId,
    validate(userParamValidation.updatePassword, {}, { stripUnknown: true }),
    userCtrl.updatePassword
  )

/** POST /apix/users/logout  */
router.route('/logout').post(userCtrl.logout)

export default router
