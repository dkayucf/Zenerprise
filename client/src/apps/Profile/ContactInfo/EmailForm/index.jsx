import React from 'react'
import { Grid, FormControlLabel, Box, Checkbox } from '@material-ui/core'
import { useFormikContext } from 'formik'
import Input from '../../../../common/FormComponents/FormikInput'
import { findIndex, path, prop, propEq } from 'ramda'

export default function EmailForm() {
  const { values, setFieldValue } = useFormikContext()

  const primaryEmailChange = (name) => (e) => {
    const currentPrimaryEmailIndex = findIndex(propEq('primaryEmail', true))(
      prop('emails', values)
    )
    setFieldValue(
      `emails.${currentPrimaryEmailIndex}.primaryEmail`,
      false,
      false
    )
    setFieldValue(name, e.target.checked, false)
  }

  return (
    <Grid container>
      {values.emails.length > 0 &&
        values.emails.map((email, index) => (
          <Box display="flex" width="100%" key={index}>
            <Grid item xs={8}>
              <Input
                name={`emails.${index}.email`}
                label="Email"
                required
                autoComplete="email"
                type="email"
              />
            </Grid>
            <Grid
              item
              xs={4}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={path(['emails', index, 'primaryEmail'], values)}
                    onChange={primaryEmailChange(
                      `emails.${index}.primaryEmail`
                    )}
                    name={`emails.${index}.primaryEmail`}
                  />
                }
                label="Primary Email"
              />
            </Grid>
          </Box>
        ))}
    </Grid>
  )
}
