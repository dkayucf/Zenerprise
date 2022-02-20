import React, { useEffect } from 'react'
import { Grid, Box, InputAdornment, CircularProgress } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import makeStyles from '@mui/styles/makeStyles'
import { useFormikContext } from 'formik'
import { useAuth } from '../../../../contexts/auth'
import Input from '../../../../common/FormComponents/FormikInput'

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.success.main,
  },
}))

// eslint-disable-next-line react/prop-types
const InputIcon = ({ isLoading, isSuccessful, isValid }) => {
  const classes = useStyles()
  if (isLoading) {
    return <CircularProgress size={20} />
  }
  if (isSuccessful) {
    if (isValid) {
      return <CheckIcon className={classes.success} />
    } else {
      return <ErrorOutlineIcon color="error" />
    }
  }
  return null
}

export default function EmailForm() {
  const { resetEmailValidate, validateEmailRequest } = useAuth()
  const { values, setFieldError } = useFormikContext()

  useEffect(() => {
    resetEmailValidate()
    setFieldError('emails', '')
  }, [values.emails, resetEmailValidate, setFieldError])

  return (
    <Grid container>
      {values.emails.length > 0 &&
        values.emails.map((email, index) => (
          <Box display="flex" width="100%" key={index} mb={2}>
            <Grid item xs={12}>
              <Input
                name={`emails.${index}.email`}
                label={email.primaryEmail ? 'Primary Email' : 'Backup Email'}
                required
                autoComplete="email"
                type="email"
                disabled={email.primaryEmail}
                readOnly={email.primaryEmail}
                validateOnChange={false}
                endAdornment={
                  !email.primaryEmail ? (
                    <InputAdornment position="end">
                      <InputIcon
                        isLoading={validateEmailRequest.status === 'pending'}
                        isValid={validateEmailRequest?.value?.isValidUser}
                        isSuccessful={validateEmailRequest.status === 'success'}
                      />
                    </InputAdornment>
                  ) : null
                }
              />
            </Grid>
          </Box>
        ))}
    </Grid>
  )
}
