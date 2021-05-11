// import PropTypes from 'prop-types'
import React from 'react'
import { Grid } from '@material-ui/core'
import Input from '../../../../common/FormComponents/FormikInput'

export default function EmailForm() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Input
          name="email"
          label="Email"
          required
          autoComplete="email"
          type="email"
        />
      </Grid>
    </Grid>
  )
}
