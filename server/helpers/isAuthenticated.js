import { APIError } from '../helpers'

const isAuth = (req, res, next) => {
  if (req.session.user.isAuth) {
    next()
  } else {
    const err = new APIError(
      'Unauthorized Request',
      httpStatus.UNAUTHORIZED,
      false
    )
    next(err)
  }
}

export default isAuth
