import React from 'react'
import { Grid } from '@mui/material'
import Password from '../../FormComponents/Password'

export default function PasswordConfirmation() {
  return (
    <>
      <Grid item xs={12}>
        <Password
          autoComplete="new-password"
          name="password"
          label="New password"
        />
      </Grid>
      <Grid item xs={12}>
        <Password
          autoComplete="new-password"
          name="confirmPassword"
          label="Confirm new password"
        />
      </Grid>
    </>
  )
}
