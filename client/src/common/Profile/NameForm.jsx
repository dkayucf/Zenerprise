import React from 'react'
import { Grid } from '@material-ui/core'
import Input from '../FormComponents/FormikInput'

export default function NameForm() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Input
          name="firstName"
          label="First Name"
          required
          autoComplete="given-name"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Input
          name="lastName"
          label="Last Name"
          required
          autoComplete="family-name"
        />
      </Grid>
    </Grid>
  )
}
