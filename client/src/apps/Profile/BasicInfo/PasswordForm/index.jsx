import React from 'react'
import { Typography, Box } from '@mui/material'
import Password from '../../../../common/FormComponents/Password'
import PasswordConfirmation from '../../../../common/authentication/PasswordConfirmation'

export default function PasswordForm() {
  return (
    <Box flexGrow={1}>
      <Box mb={2}>
        <Typography>Confirm your current password</Typography>
        <Password
          autoComplete="current-password"
          name="oldPassword"
          label="Old password"
        />
      </Box>
      <Box>
        <Typography>Enter your new password</Typography>
        <PasswordConfirmation />
      </Box>
    </Box>
  )
}
