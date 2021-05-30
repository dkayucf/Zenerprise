import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import { Dashboard, Profile } from '../Pages/protected/'
import { propOr } from 'ramda'

export const PrivateRoute = ({ children, ...rest }) => {
  const { isAuth } = useAuth()

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

PrivateRoute.propTypes = {
  children: PropTypes.node,
}

export const ProtectedRoutes = () => {
  const { routes } = useAuth()
  let { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Dashboard />
      </Route>
      <Route exact path={`${path}/dashboard`}>
        <Dashboard />
      </Route>
      <Route exact path={`${path}/profile`}>
        <Profile />
      </Route>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {routes.length > 0 &&
            routes.map((route, i) => {
              const subRoutes = propOr([], 'routes', route)
              return (
                <Switch key={i}>
                  <Route exact path={`${path}${route.path}`}>
                    <RouteGroup filepath={route.component} />
                  </Route>
                  {subRoutes.map((subRoute, i) => (
                    <Route key={i} exact path={`${path}${subRoute.path}`}>
                      <RouteGroup
                        filepath={`${route.component}/${subRoute.component}`}
                      />
                    </Route>
                  ))}
                </Switch>
              )
            })}
        </Switch>
      </Suspense>
    </Switch>
  )
}

const LoadLazyRouteComponent = (filePath) =>
  lazy(async () => {
    try {
      return await import(`../Pages/protected/${filePath}`)
    } catch (e) {
      const msg = `Error importing dynamic route files. A file or files may be missing.`
      // eslint-disable-next-line no-console
      console.warn(msg)
      return { default: () => null }
    }
  })

const RouteGroup = ({ filepath }) => {
  const LazyRouteComponent = LoadLazyRouteComponent(filepath)

  return <LazyRouteComponent />
}

RouteGroup.propTypes = {
  filepath: PropTypes.string,
}
