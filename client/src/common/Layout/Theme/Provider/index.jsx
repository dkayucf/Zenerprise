import React from 'react'
import PropTypes from 'prop-types'
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles'
import theme from '../theme'

const ZenerpriseThemeProvider = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </StyledEngineProvider>
  )
}

ZenerpriseThemeProvider.propTypes = {
  children: PropTypes.node,
}

export default ZenerpriseThemeProvider
