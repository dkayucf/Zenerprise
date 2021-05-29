import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import theme from '../theme'

const ZenerpriseThemeProvider = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MuiThemeProvider>
  )
}

ZenerpriseThemeProvider.propTypes = {
  children: PropTypes.node,
}

export default ZenerpriseThemeProvider
