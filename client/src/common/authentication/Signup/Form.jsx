import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Grid, InputAdornment, CircularProgress } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { makeStyles } from '@material-ui/core/styles'
import PhoneNumber from '../../FormComponents/PhoneNumber'
import Password from '../../FormComponents/Password'
import Input from '../../FormComponents/FormikInput'
import LoadingButton from '../../LoadingButton'
import { useAuth } from '../../../contexts/auth'
import { LinkRouter } from '../../RouterLink'
import { useRouter } from '../../../hooks/useRouter'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
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

export default function SignUpForm({
  handleSubmit,
  values,
  isValid,
  dirty,
  setFieldError,
}) {
  const classes = useStyles()
  const {
    signUpStatus,
    resetLoginRequest,
    resetSignupRequest,
    resetEmailValidate,
    resetPhoneValidate,
    useResource,
  } = useAuth()
  const { isLoading } = signUpStatus
  const { location } = useRouter()

  useEffect(() => {
    resetEmailValidate()
    setFieldError('email', '')
  }, [values.email, resetEmailValidate, setFieldError])

  useEffect(() => {
    resetPhoneValidate()
    setFieldError('phone', '')
  }, [values.phone, resetPhoneValidate, setFieldError])

  useEffect(() => {
    resetLoginRequest()
    resetSignupRequest()
  }, [values, resetLoginRequest, resetSignupRequest, location])

  const {
    isLoading: emailValidationLoading,
    isSuccessful,
    response,
  } = useResource('email')

  const {
    isLoading: phoneValidationLoading,
    isSuccessful: phoneValidationSuccessful,
    response: phoneValidationResponse,
  } = useResource('phone')

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Grid container>
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
        <Grid item xs={12}>
          <Input
            name="email"
            label="Email"
            required
            autoComplete="email"
            type="email"
            validateOnChange={false}
            endAdornment={
              <InputAdornment position="end">
                <InputIcon
                  isLoading={emailValidationLoading}
                  isValid={response.isValidUser}
                  isSuccessful={isSuccessful}
                />
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <PhoneNumber id="phone" name="phone" required>
            <InputAdornment
              position="end"
              style={{ position: 'absolute', right: '15px', bottom: '36px' }}
            >
              <InputIcon
                isLoading={phoneValidationLoading}
                isValid={phoneValidationResponse.isValidUser}
                isSuccessful={phoneValidationSuccessful}
              />
            </InputAdornment>
          </PhoneNumber>
        </Grid>
        <Grid item xs={12}>
          <Password
            autoComplete="new-password"
            name="password"
            label="Password"
          />
        </Grid>
        <Grid item xs={12}>
          <Password
            autoComplete="new-password"
            name="confirmPassword"
            label="Confirm Password"
          />
        </Grid>
        <Grid item xs={12}>
          <Box mt={3} mb={1}>
            <LoadingButton
              disabled={!isValid || !dirty}
              isPending={isLoading}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Sign up
            </LoadingButton>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <LinkRouter to="/login" variant="body2">
            Already have an account? Sign in
          </LinkRouter>
        </Grid>
      </Grid>
    </form>
  )
}

SignUpForm.propTypes = {
  dirty: PropTypes.bool,
  isValid: PropTypes.bool,
  handleSubmit: PropTypes.func,
  values: PropTypes.object,
  setFieldError: PropTypes.func,
}
