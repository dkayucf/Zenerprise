import React from 'react'
import { Grid } from '@material-ui/core'
import Select from '../../../../common/FormComponents/FormikSelect'
import PhoneNumber from '../../../../common/FormComponents/PhoneNumber'

export default function PhoneForm() {
  return (
    <Grid container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Select
            id="phoneType"
            name="type"
            label="Phone Type"
            margin="normal"
            fullWidth
            required
          >
            <option value="mobile">Mobile</option>
            <option value="home">Home</option>
            <option value="work">Work</option>
          </Select>
        </Grid>
        <Grid item xs={12} sm={8}>
          <PhoneNumber id="phone" name="phone" required />
        </Grid>
      </Grid>
    </Grid>
  )
}

PhoneForm.propTypes = {}
