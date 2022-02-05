import express from 'express'
import validate from 'express-validation'
import userParamValidation from './param-validation/user'
import userCtrl from '../../controllers/user'
import { checkUserId } from '../../helpers/'

const router = express.Router() // eslint-disable-line new-cap

/** POST /apix/users/validate-user  */
router
  .route('/validate-user')
  .post(
    validate(userParamValidation.validateUser, {}, { stripUnknown: true }),
    userCtrl.validateUser
  )

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

/** /apix/users/email  */
router
  .route('/email')
  .put(
    checkUserId,
    validate(userParamValidation.updateEmail, {}, { stripUnknown: true }),
    userCtrl.updateEmail
  )
  .post(
    checkUserId,
    validate(userParamValidation.addEmail, {}, { stripUnknown: true }),
    userCtrl.addEmail
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

/** GET /apix/users/profile  */
router.route('/profile').get(checkUserId, userCtrl.userProfile)

export default router
