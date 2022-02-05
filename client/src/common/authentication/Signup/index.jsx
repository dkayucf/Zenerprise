import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import AuthCard from '../AuthCard'
import SignUpForm from './Form'
import { fullValidatorForSchema } from '../../FormComponents/helpers'

import { useAuth } from '../../../contexts/auth'

let _cachedEmail = ''
let _isValidEmail = false
let _cachedPhone = ''
let _isValidPhone = false

const validationSchema = (validateEmail, validatePhone) => {
  return yup.object({
    firstName: yup
      .string('Enter your first name')
      .required('First name is required'),
    lastName: yup
      .string('Enter your last name')
      .required('Last name is required'),
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .test('Valid Email', 'Email is unavailable', async (value) => {
        if (value !== '' && value !== _cachedEmail) {
          const validatedEmail = await validateEmail(value)
          _isValidEmail = validatedEmail
          _cachedEmail = value
        }

        return _isValidEmail
      })
      .required('Email is required'),
    phone: yup
      .string('Enter your mobile phone number ')
      .test(
        'Valid Phone Number',
        'Phone number is unavailable',
        async (value) => {
          if (value !== '' && value !== _cachedPhone) {
            const validatedPhone = await validatePhone(value)
            _isValidPhone = validatedPhone
            _cachedPhone = value
          }
          return _isValidPhone
        }
      )
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
      .matches(
        /^((?=.*?[0-9])|(?=.*?[a-zA-Z]))/,
        'At least 1 letter or number.'
      )
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  })
}

const initialValues = {
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
}

export default function SignUp() {
  const { signup, validateEmail, validatePhone } = useAuth()

  return (
    <AuthCard logo={<LockOutlinedIcon />} cardHeading="Sign Up">
      <Formik
        initialValues={initialValues}
        onSubmit={signup}
        validate={fullValidatorForSchema(
          validationSchema(validateEmail, validatePhone)
        )}
        validateOnChange={false}
      >
        {({ values, handleSubmit, isValid, dirty, setFieldError }) => (
          <SignUpForm
            values={values}
            handleSubmit={handleSubmit}
            isValid={isValid}
            dirty={dirty}
            setFieldError={setFieldError}
          />
        )}
      </Formik>
    </AuthCard>
  )
}
