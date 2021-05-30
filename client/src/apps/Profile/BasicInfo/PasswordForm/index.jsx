import React from 'react'
import { Grid } from '@material-ui/core'
import Password from '../../../../common/FormComponents/Password'

export default function PasswordForm() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Password
          autoComplete="current-password"
          name="oldPassword"
          label="Old password"
        />
      </Grid>
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
    </Grid>
  )
}
