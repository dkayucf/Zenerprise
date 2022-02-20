import React from 'react'
// import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import Input from '../../../../common/FormComponents/FormikInput'
import CountrySelect from '../../../../common/FormComponents/CountryInput'
import StateSelect from '../../../../common/FormComponents/StatesInput'

export default function AddressForm() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <CountrySelect />
      </Grid>
      <Grid item xs={12}>
        <Input
          required
          name="addressLineOne"
          label="Address One"
          autoComplete="address-line1"
        />
      </Grid>
      <Grid item xs={12}>
        <Input
          name="addressLineTwo"
          label="Address Two"
          autoComplete="address-line2"
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Input
            required
            name="city"
            label="City"
            autoComplete="address-level2"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StateSelect />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Input
            required
            name="postalCode"
            label="Postal Code/Zip Code"
            autoComplete="postal-code"
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

AddressForm.propTypes = {}
