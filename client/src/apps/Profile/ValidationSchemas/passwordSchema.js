import * as yup from 'yup'

const passwordValidationSchema = yup.object({
  oldPassword: yup
    .string('Enter your old password')
    .required('Old password is required'),
  password: yup
    .string('Enter your new password')
    .notOneOf(
      [yup.ref('oldPassword'), null],
      'New password must be different then old password'
    )
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
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password'), null],
      'Confirm password must match new password'
    )
    .required('Confirm password is required'),
})

export default passwordValidationSchema
