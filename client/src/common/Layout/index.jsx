import React from 'react'
import PropTypes from 'prop-types'
import { CssBaseline } from '@material-ui/core'

import ProtectedLayout from './ProtectedLayout'
import PublicLayout from './PublicLayout'

import ThemeProvider from './Theme/Provider'
import { useAuth } from '../../contexts/auth'

const Layout = ({ children }) => {
  const { user } = useAuth()

  return (
    <ThemeProvider>
      <CssBaseline />
      {user?.isAuth ? (
        <ProtectedLayout>{children}</ProtectedLayout>
      ) : (
        <PublicLayout>{children}</PublicLayout>
      )}
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout
