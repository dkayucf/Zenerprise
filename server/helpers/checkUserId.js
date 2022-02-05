import { APIError } from '../helpers'
import { pathOr } from 'ramda'

const checkUserId = (req, res, next) => {
  const userId = pathOr(null, ['session', 'user', 'id'], req)

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

export default checkUserId
