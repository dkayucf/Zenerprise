import React from 'react'
import { Grid } from '@material-ui/core'
import Password from '../../../../common/FormComponents/Password'

export default function PasswordForm() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Password />
      </Grid>
      <Grid item xs={12}>
        <Password confirmPassword />
      </Grid>
    </Grid>
  )
}
