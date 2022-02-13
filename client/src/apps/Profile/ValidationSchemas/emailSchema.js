import * as yup from 'yup'

let _cachedEmail = ''
let _isValidEmail = false

const emailValidationSchema = (validateEmail) =>
  yup.object().shape({
    emails: yup.array().of(
      yup.object({
        primaryEmail: yup.boolean(),
        email: yup.string().when('primaryEmail', {
          is: true,
          then: yup.string(),
          otherwise: yup
            .string('Enter your email')
            .email('Enter a valid email')
            .test(
              'Valid Email',
              'Email is unavailable. Please choose a different email.',
              async (value) => {
                if (value !== '' && value !== _cachedEmail) {
                  const validatedEmail = await validateEmail(value)
                  _isValidEmail = validatedEmail
                  _cachedEmail = value
                }

                return _isValidEmail
              }
            )
            .required('Email is required'),
        }),
      })
    ),
  })

export default emailValidationSchema
