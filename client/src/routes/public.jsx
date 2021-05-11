import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/provideAuth'
import Home from '../Pages/public/Home'
import {
  LoginPage,
  Signup,
  ForgotPassword,
  ResetPassword,
} from '../Pages/public/Authentication'

export const PublicRoute = ({ children, ...rest }) => {
  const { isAuth } = useAuth()

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          <Redirect
            to={{
              pathname: '/auth/dashboard',
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  )
}

PublicRoute.propTypes = {
  children: PropTypes.node,
}

export const PublicRoutes = () => {
  return (
    <Switch>
      <PublicRoute exact path="/">
        <Home />
      </PublicRoute>
      <PublicRoute exact path="/login">
        <LoginPage />
      </PublicRoute>
      <PublicRoute exact path="/register">
        <Signup />
      </PublicRoute>
      <PublicRoute exact path="/forgot-password">
        <ForgotPassword />
      </PublicRoute>
      <PublicRoute exact path="/forgot-email">
        {/* <ForgotPassword /> */}
      </PublicRoute>
      <PublicRoute exact path="/reset-password">
        <ResetPassword />
      </PublicRoute>
    </Switch>
  )
}
