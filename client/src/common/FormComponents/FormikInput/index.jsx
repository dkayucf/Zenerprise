import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useFormikContext } from 'formik'

import {
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@material-ui/core'
import { split, path } from 'ramda'

export default function FormikInput({
  name,
  label,
  required,
  autoComplete,
  type,
  validateOnChange,
  ...rest
}) {
  const {
    values,
    touched,
    errors,
    setFieldTouched,
    setFieldValue,
    initialValues,
  } = useFormikContext()

  const fieldName = split('.', name)
  const inputTouched = path(fieldName, touched)
  const inputErrors = path(fieldName, errors)
  const inputValue = path(fieldName, values)
  const hasErrors = inputErrors && inputErrors.length > 0
  const initialValue = path(fieldName, initialValues)

  const handleChange = useCallback(
    (e) => {
      if (validateOnChange) {
        setFieldValue(name, e.target.value, true)
      } else {
        setFieldValue(name, e.target.value, false)
      }
    },
    [setFieldValue, validateOnChange, name]
  )

  const handleBlur = useCallback(
    (e) => {
      if (e.target.value !== initialValue) {
        setFieldTouched(name, true, true)
      } else {
        setFieldTouched(name, true, false)
      }
    },
    [setFieldTouched, initialValue, name]
  )

  return (
    <FormControl
      variant="outlined"
      error={(inputValue !== '' || inputTouched) && hasErrors ? true : false}
      fullWidth
      margin="normal"
    >
      <InputLabel required={required} htmlFor={name}>
        {label}
      </InputLabel>
      <OutlinedInput
        label={label}
        required={required}
        autoComplete={autoComplete}
        type={type}
        value={inputValue}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
      />
      {(inputValue !== '' || inputTouched) &&
        hasErrors &&
        inputErrors.map((error, i) => (
          <FormHelperText key={i} id={`${name}-error-text`}>
            {error}
          </FormHelperText>
        ))}
    </FormControl>
  )
}

FormikInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
  required: PropTypes.bool,
  validateOnChange: PropTypes.bool,
}

FormikInput.defaultProps = {
  required: false,
  autoComplete: 'none',
  type: 'text',
  validateOnChange: true,
}
