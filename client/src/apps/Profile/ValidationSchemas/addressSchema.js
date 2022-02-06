import { anyPass, findIndex, path, prop, propEq } from 'ramda'
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
    .nullable()
    .required('State is required'),
  country: yup
    .object({
      code: yup.string(),
      label: yup.string(),
    })
    .test(
      'country-validation',
      'Invalid country',
      (value, { options, parent }) => {
        const countries = path(['context', 'countries'], options)
        const countryInput = prop('country', parent)
        const isMatch =
          findIndex(
            anyPass([
              propEq('code', countryInput?.code),
              propEq('label', countryInput?.label),
            ]),
            countries
          ) !== -1
        return isMatch
      }
    )
    .nullable()
    .required('Country is required'),
})

export default addressValidationSchema
