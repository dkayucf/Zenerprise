import React from 'react'
import * as yup from 'yup'
import 'yup-phone'
import { Typography, Divider, Box } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import makeStyles from '@mui/styles/makeStyles'
import LoginForm from './Form'
import AuthCard from '../AuthCard'
import { ButtonRouter } from '../../RouterLink'
import GenericForm from '../../FormComponents/GenericForm'

import { useAuth } from '../../../contexts/auth'
import { path, test, toUpper } from 'ramda'

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
    .test('is-email', 'Enter a valid email', (value, context) => {
      if (!value) return true
      const hasAtSymbol = test(/^(?=.*?[@])/, value)
      const countryCode = path(
        ['parent', 'phoneObject', 'countryCode'],
        context
      )
      if (countryCode && !hasAtSymbol) return true

      if (hasAtSymbol) {
        return yup
          .string()
          .email('Enter a valid email')
          .isValid(value)
          .then((response) => response)
          .catch((err) => err)
      }
    })
    .test('is-email', 'Enter a valid phone number', (value, context) => {
      if (!value) return true
      const countryCode = path(
        ['parent', 'phoneObject', 'countryCode'],
        context
      )
      if (countryCode) {
        const phoneValidationSchema = yup
          .string()
          .phone(toUpper(countryCode), true, '${path} is invalid')
          .required()

        return phoneValidationSchema.isValidSync(value)
      } else {
        return false
      }
    })
    .required('Email or mobile phone number is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be a minimum of 8 characters long')
    .required('Password is required'),
})

const initialValues = {
  user: '',
  password: '',
}

export default function SignIn() {
  const classes = useStyles()
  const { login } = useAuth()

  return (
    <AuthCard logo={<LockOutlinedIcon />} cardHeading="Sign in">
      <GenericForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={login}
      >
        <LoginForm />
      </GenericForm>
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
