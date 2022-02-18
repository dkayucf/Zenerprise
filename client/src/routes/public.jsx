import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/auth'
import Home from '../Pages/public/Home'
import {
  LoginPage,
  Signup,
  ForgotPassword,
  ResetPassword,
} from '../Pages/public/Authentication'

export const PublicRoute = ({ children, ...rest }) => {
  const { user, resetLogin } = useAuth()
  const location = useLocation()

  useEffect(() => {
    resetLogin()
  }, [location, resetLogin])

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user?.isAuth ? (
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
