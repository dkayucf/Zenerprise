import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PhoneNumber from '../../FormComponents/PhoneNumber'
import Password from '../../FormComponents/Password'
import Input from '../../FormComponents/FormikInput'
import LoadingButton from '../../LoadingButton'
import { useAuth } from '../../../contexts/provideAuth'
import { LinkRouter } from '../../RouterLink'
import { useRouter } from '../../../hooks/useRouter'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

export default function SignUpForm({ handleSubmit, values }) {
  const classes = useStyles()
  const { signUpStatus, resetLoginRequest, resetSignupRequest } = useAuth()
  const { isLoading } = signUpStatus
  const { location } = useRouter()

  useEffect(() => {
    resetLoginRequest()
    resetSignupRequest()
  }, [values, resetLoginRequest, resetSignupRequest, location])

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
          />
        </Grid>
        <Grid item xs={12}>
          <PhoneNumber id="phone" name="phone" required />
        </Grid>
        <Grid item xs={12}>
          <Password autoComplete="new-password" />
        </Grid>
        <Grid item xs={12}>
          <Password confirmPassword />
        </Grid>
        <Grid item xs={12}>
          <Box mt={3} mb={1}>
            <LoadingButton
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
  handleSubmit: PropTypes.func,
  values: PropTypes.object,
}
