import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useFormikContext } from 'formik'

import {
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material'
import { split, path, pathOr } from 'ramda'

export default function FormikInput({
  name,
  label,
  required,
  autoComplete,
  type,
  validateOnChange,
  ...rest
}) {
  const { values, touched, errors, setFieldTouched, setFieldValue } =
    useFormikContext()

  const fieldName = split('.', name)
  const inputTouched = pathOr(false, fieldName, touched)
  const inputError = pathOr(false, fieldName, errors)
  const inputValue = path(fieldName, values)

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

  const handleBlur = useCallback(() => {
    setFieldTouched(name, true, true)
  }, [setFieldTouched, name])

  return (
    <FormControl
      variant="outlined"
      error={inputError && inputTouched}
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
      {inputTouched && inputError && (
        <FormHelperText id={`${name}-error-text`}>{inputError}</FormHelperText>
      )}
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
