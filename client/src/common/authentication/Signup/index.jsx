import React, { useCallback } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import AuthCard from '../AuthCard'
import SignUpForm from './Form'
import { fullValidatorForSchema } from '../../FormComponents/helpers'

import { useAuth } from '../../../contexts/provideAuth'
import { useRouter } from '../../../hooks/useRouter'

const validationSchema = yup.object({
  firstName: yup
    .string('Enter your first name')
    .required('First name is required'),
  lastName: yup
    .string('Enter your last name')
    .required('Last name is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  phone: yup
    .string('Enter your mobile phone number ')
    .required('Mobile phone number is required'),
  phoneData: yup.object({
    countryCode: yup.string(),
    dialCode: yup.string(),
    format: yup.string(),
    name: yup.string(),
  }),
  phoneFormatted: yup.string(),
  password: yup
    .string('Enter your password')
    .matches(/^.{8,}$/, '8 characters or longer')
    .matches(
      /^((?=.*?[a-zA-Z])|(?=.*?[#?!@$%^&*-]))/,
      'At least 1 letter or symbol (like !@#$%^).'
    )
    .matches(
      /^((?=.*?[0-9])|(?=.*?[#?!@$%^&*-]))/,
      'At least 1 number or symbol (like !@#$%^).'
    )
    .matches(/^((?=.*?[0-9])|(?=.*?[a-zA-Z]))/, 'At least 1 letter or number.')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
})

export default function SignUp() {
  const { push } = useRouter()
  const { signup } = useAuth()
  const redirect = useCallback(() => push('/auth/dashboard'), [push])

  return (
    <AuthCard logo={<LockOutlinedIcon />} cardHeading="Sign Up">
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          phoneData: {
            countryCode: '',
            dialCode: '',
            format: '',
            name: '',
          },
          password: '',
          confirmPassword: '',
        }}
        onSubmit={useCallback((values) => signup(values, redirect), [
          signup,
          redirect,
        ])}
        validate={fullValidatorForSchema(validationSchema)}
      >
        {({ values, handleSubmit }) => (
          <SignUpForm values={values} handleSubmit={handleSubmit} />
        )}
      </Formik>
    </AuthCard>
  )
}
