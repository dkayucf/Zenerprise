import React from 'react'
import PropTypes from 'prop-types'

import Header from './/Header'
import Drawer from './Drawer'
import Footer from '../Shared/Footer'
import ShiftContainer from './ShiftContainer'
import HeaderProvider from '../../../contexts/header'
import SnackbarProvider from '../../../contexts/snackbar'

const ProtectedLayout = ({ children }) => (
  <HeaderProvider>
    <Header />
    <Drawer />
    <ShiftContainer component="main">
      <SnackbarProvider>{children}</SnackbarProvider>
    </ShiftContainer>
    <ShiftContainer component="footer">
      <Footer />
    </ShiftContainer>
  </HeaderProvider>
)

ProtectedLayout.propTypes = {
  children: PropTypes.node,
}

export default ProtectedLayout
