import * as yup from 'yup'

const addressValidationSchema = yup.object({
  addressLineOne: yup.string().required('Address One is required'),
  addressLineTwo: yup.string(),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal Code is required'),
  state: yup
    .object({
      value: yup.string(),
      label: yup.string(),
    })
    .required('State is required'),
  country: yup
    .object({
      code: yup.string(),
      label: yup.string(),
    })
    .nullable()
    .required('Country is required'),
})

export default addressValidationSchema
