import {
  compose,
  dissoc,
  evolve,
  includes,
  reject,
  prop,
  map
} from 'ramda'

const transformRoutesByRole = (role, routes) => {
  if (!role) {
    return []
  }

  const notIncludedRole = route => !includes(role, prop('allowedRoles', route))

  return compose(
      map(compose(
        dissoc('allowedRoles'),
        evolve({
          routes: compose(
            map(dissoc('allowedRoles')),
            reject(notIncludedRole)
          )
        })
      )),
      reject(notIncludedRole),
      prop('routes')
    )(routes)
}

module.exports.transformRoutesByRole = transformRoutesByRole
