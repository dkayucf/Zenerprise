import React, { useCallback } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Typography, Divider, Box } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'
import LoginForm from './Form'
import AuthCard from '../AuthCard'
import { ButtonRouter } from '../../RouterLink'
import { fullValidatorForSchema } from '../../FormComponents/helpers'

import { useAuth } from '../../../contexts/auth'
import { useRouter } from '../../../hooks/useRouter'
import { test } from 'ramda'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 1),
  },
  dividerText: {
    position: 'relative',
    top: '.7em',
    padding: '0 .5em',
    backgroundColor: '#fff',
    color: '#6c7378',
  },
}))

const validationSchema = yup.object({
  user: yup
    .string('Enter your email or mobile phone number')
    .test('is-email', 'Enter a valid email', (value) => {
      const hasAtSymbol = test(/^(?=.*?[@])/, value)
      if (hasAtSymbol) {
        return yup
          .string()
          .email('Enter a valid email')
          .isValid(value)
          .then((response) => response)
          .catch((err) => err)
      } else {
        return true
      }
    })
    .required('Email or mobile phone number is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
})

export default function SignIn() {
  const { push } = useRouter()
  const classes = useStyles()
  const { login } = useAuth()
  const redirect = useCallback(() => push('/auth/dashboard'), [push])

  return (
    <AuthCard logo={<LockOutlinedIcon />} cardHeading="Sign in">
      <Formik
        initialValues={{
          user: '',
          password: '',
        }}
        onSubmit={useCallback(
          (values) => login(values, redirect),
          [login, redirect]
        )}
        validate={fullValidatorForSchema(validationSchema)}
      >
        {({ handleSubmit, values }) => (
          <LoginForm handleSubmit={handleSubmit} values={values} />
        )}
      </Formik>
      <Box textAlign="center">
        <Typography
          variant="body1"
          component="span"
          className={classes.dividerText}
        >
          or
        </Typography>
        <Divider />
      </Box>
      <Box mt={4}>
        <ButtonRouter fullWidth variant="contained" to="/register">
          Sign Up
        </ButtonRouter>
      </Box>
    </AuthCard>
  )
}
