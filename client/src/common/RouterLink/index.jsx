import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { Link, Button } from '@mui/material/'

function LinkRouter({ to, children, ...rest }) {
  return (
    <Link component={RouterLink} to={to} {...rest}>
      {children}
    </Link>
  )
}

function ButtonRouter({ to, children, ...rest }) {
  return (
    <Button component={RouterLink} to={to} {...rest}>
      {children}
    </Button>
  )
}

LinkRouter.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
}

ButtonRouter.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
}

export { LinkRouter, ButtonRouter }
