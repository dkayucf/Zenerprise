import React from 'react'
import PropTypes from 'prop-types'

import { ThemeProvider } from '@material-ui/core/styles'
import theme from '../theme'

const ZenerpriseThemeProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

ZenerpriseThemeProvider.propTypes = {
  children: PropTypes.node,
}

export default ZenerpriseThemeProvider
