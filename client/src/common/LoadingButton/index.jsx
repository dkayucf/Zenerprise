import React from 'react'
import PropTypes from 'prop-types'

import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import styled from '@emotion/styled'

const StyledCircularProgress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: ${(props) => props.size * -0.5}px;
  margin-left: ${(props) => props.size * -0.5}px;
`

const LoadingButton = ({ isPending, disabled, ...props }) => {
  return (
    <Box position="relative">
      <Button {...props} disabled={disabled || isPending} />
      {isPending && <StyledCircularProgress size={24} />}
    </Box>
  )
}

LoadingButton.propTypes = {
  isPending: PropTypes.bool,
  disabled: PropTypes.bool,
}

LoadingButton.defaultProps = {
  isPending: false,
  disabled: false,
}

export default LoadingButton
