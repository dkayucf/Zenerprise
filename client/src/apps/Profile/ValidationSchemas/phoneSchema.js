import * as yup from 'yup'

const phoneValidationSchema = yup.object({
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
})

export default phoneValidationSchema
