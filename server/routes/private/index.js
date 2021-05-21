import express from 'express'
import {
  prop,
  path,
  find,
  propEq,
  includes,
  compose,
  filter,
  head
} from 'ramda'
import httpStatus from 'http-status'
import testRoutes from './test'
import usersRoutes from './user'
import inventoryRoutes from './inventory'
import APIError from '../../helpers/APIError'

const router = express.Router()

const checkAllowedRole = routeId => (req, res, next) => {
  const subRoutePath = prop('path', req)
  const sessionRoutes = path(['session', 'userRoutes', 'routes'], req)
  const userRole = path(['session', 'userRole'], req)
  const routeObj = find(propEq('id', routeId), sessionRoutes)

  const isAllowedSubRoute = compose(
    includes(userRole),
    prop('allowedRoles'),
    head,
    filter(route => includes(subRoutePath, prop('path', route))),
    prop('routes')
  )(routeObj)

  const isAllowedMainRoute = includes(userRole, prop('allowedRoles', routeObj))

  if (isAllowedMainRoute && isAllowedSubRoute) {
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

router.use('/test', testRoutes)

router.use('/users', usersRoutes)

router.use('/inventory', checkAllowedRole('inventory'), inventoryRoutes)

export default router
