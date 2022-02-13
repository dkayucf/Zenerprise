import {
  allPass,
  evolve,
  findIndex,
  map,
  path,
  pipe,
  prop,
  propEq,
  toLower,
} from 'ramda'
import * as yup from 'yup'

const addressValidationSchema = yup.object({
  addressLineOne: yup.string().required('Address One is required'),
  addressLineTwo: yup.string().nullable(),
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
    .test('country-validation', 'Invalid country', (value, schema) => {
      if (!value) return true // This will make the required message display instead of this
      const { options, parent } = schema
      const countries = pipe(
        path(['context', 'countries']),
        map(
          evolve({
            label: toLower,
          })
        )
      )(options)

      const countryInput = pipe(
        prop('country'),
        evolve({
          label: toLower,
        })
      )(parent)

      const isMatch =
        findIndex(
          allPass([
            propEq('code', countryInput?.code),
            propEq('label', countryInput?.label),
          ]),
          countries
        ) !== -1
      return isMatch
    })
    .nullable()
    .required('Country is required'),
})

export default addressValidationSchema
