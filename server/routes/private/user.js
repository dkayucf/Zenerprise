import express from 'express'
import validate from 'express-validation'
import userParamValidation from './param-validation/user'
import userCtrl from '../../controllers/user'

const router = express.Router() // eslint-disable-line new-cap

/** PUT /apix/users/name  */
router
  .route('/name')
  .put(
    validate(userParamValidation.updateName, {}, { stripUnknown: true }),
    userCtrl.updateName
  )

/** PUT /apix/users/address  */
router
  .route('/address')
  .put(
    validate(userParamValidation.updateAddress, {}, { stripUnknown: true }),
    userCtrl.updateAddress
  )

/** PUT /apix/users/email  */
router
  .route('/email')
  .put(
    validate(userParamValidation.updateEmail, {}, { stripUnknown: true }),
    userCtrl.updateEmail
  )

/** PUT /apix/users/primary-phone  */
router
  .route('/primary-phone')
  .put(
    validate(
      userParamValidation.updatePrimaryPhone,
      {},
      { stripUnknown: true }
    ),
    userCtrl.updatePrimaryPhone
  )

/** POST /apix/users/logout  */
router.route('/logout').post(userCtrl.logout)

export default router
