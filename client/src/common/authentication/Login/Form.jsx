import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import UserInput from '../../FormComponents/UserInput'
import Password from '../../FormComponents/Password'
import LoadingButton from '../../LoadingButton'
import { LinkRouter } from '../../RouterLink'
import { useAuth } from '../../../contexts/auth'
import { Box } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

export default function SignInForm() {
  const classes = useStyles()
  const { loginStatus } = useAuth()

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
