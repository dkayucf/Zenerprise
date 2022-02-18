import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { useFormikContext } from 'formik'
import UserInput from '../../FormComponents/UserInput'
import Password from '../../FormComponents/Password'
import LoadingButton from '../../LoadingButton'
import { LinkRouter } from '../../RouterLink'
import { useAuth } from '../../../contexts/auth'
import { Box } from '@material-ui/core'
import { isEmpty } from 'ramda'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

export default function SignInForm() {
  const classes = useStyles()
  const { loginStatus, loginStatusMessage } = useAuth()
  const { touched, errors, setErrors, setTouched } = useFormikContext()
  const hasErrors = !isEmpty(errors)
  const hasBeenTouched = !isEmpty(touched)

  useEffect(() => {
    if (loginStatus === 'error') {
      setErrors({
        user: ' ',
        password: ' ',
      })
      setTouched(
        {
          user: true,
          password: true,
        },
        false
      )
    }
  }, [loginStatus, loginStatusMessage, setErrors, setTouched])

  return (
    <Box className={classes.form}>
      <UserInput />
      <Password
        isLogin
        autoComplete="current-password"
        name="password"
        label="Password"
      />
      <LinkRouter to="/forgot-password" variant="body2">
        Forgot password?
      </LinkRouter>
      <Box mt={3} mb={1}>
        <LoadingButton
          isPending={loginStatus === 'pending'}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={(hasBeenTouched && hasErrors) || loginStatus === 'error'}
        >
          Sign In
        </LoadingButton>
      </Box>
    </Box>
  )
}

SignInForm.propTypes = {
  handleSubmit: PropTypes.func,
  values: PropTypes.object,
}
