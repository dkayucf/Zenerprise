import React from 'react'
import { Formik } from 'formik'
import yup from '../../FormComponents/helpers/yupMethods'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import AuthCard from '../AuthCard'
import SignUpForm from './Form'

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
      .test(
        'Valid Email',
        'Email is unavailable.  Please choose a different email.',
        async (value, context) => {
          if (!value) return true //bypass this validation to display required error
          if (value !== _cachedEmail) {
            const { isValidUser, message } = await validateEmail(value)

            if (message) {
              return context.createError({
                path: context.path,
                message: message,
              })
            }
            _isValidEmail = isValidUser
            _cachedEmail = value
          }

          return _isValidEmail
        }
      )
      .required('Email is required'),
    phone: yup
      .string('Enter your phone number ')
      .test(
        'Valid Phone Number',
        'Phone number is unavailable',
        async (value) => {
          if (!value) return true //bypass this validation to display required error
          if (value !== _cachedPhone) {
            const validatedPhone = await validatePhone(value)
            _isValidPhone = validatedPhone
            _cachedPhone = value
          }
          return _isValidPhone
        }
      )
      .required('Phone number is required'),
    phoneData: yup.object({
      countryCode: yup.string(),
      dialCode: yup.string(),
      format: yup.string(),
      name: yup.string(),
    }),
    phoneFormatted: yup.string(),
    password: yup
      .string('Enter your password')
      .min(8, 'Password must be 8 characters or longer')
      .strongPassword()
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
        validationSchema={validationSchema(validateEmail, validatePhone)}
        validateOnChange={false}
      >
        {({ values, isValid, dirty, setFieldError, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <SignUpForm
              values={values}
              isValid={isValid}
              dirty={dirty}
              setFieldError={setFieldError}
            />
          </form>
        )}
      </Formik>
    </AuthCard>
  )
}
