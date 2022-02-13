import React from 'react'
import { Grid } from '@material-ui/core'
import Password from '../../../../common/FormComponents/Password'
import PasswordConfirmation from '../../../../common/authentication/PasswordConfirmation'

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
      <PasswordConfirmation />
    </Grid>
  )
}
