import express from 'express'
import validate from 'express-validation'
import paramValidation from './param-validation/user/param-validation'
import userCtrl from '../../controllers/user'

const router = express.Router() // eslint-disable-line new-cap

/** POST /api/users/validate-user  */
router
  .route('/validate-user')
  .post(
    validate(paramValidation.validateUser, {}, { stripUnknown: true }),
    userCtrl.validateUser
  )

/** POST /api/users/register - create new user and return corresponding user object and token */
router
  .route('/register')
  .post(
    validate(paramValidation.registerUser, {}, { stripUnknown: true }),
    userCtrl.register
  )

/** POST /api/users/login  */
router
  .route('/login')
  .post(
    validate(paramValidation.login, {}, { stripUnknown: true }),
    userCtrl.login
  )

/** POST /api/users/forgot-password  */
router
  .route('/forgot-password')
  .put(
    validate(paramValidation.forgotPassword, {}, { stripUnknown: true }),
    userCtrl.forgotPassword
  )

export default router
