import React from 'react'
import PropTypes from 'prop-types'
import { useFormikContext } from 'formik'
import {
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@material-ui/core'

export default function FormikInput({
  name,
  label,
  required,
  autoComplete,
  type,
  ...rest
}) {
  const { values, handleChange, touched, errors, setFieldTouched } =
    useFormikContext()
  const inputTouched = touched[name]
  const inputErrors = errors[name]
  const inputValue = values[name]
  const hasErrors = inputErrors && inputErrors.length > 0

  return (
    <FormControl
      variant="outlined"
      error={inputTouched && hasErrors}
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
        onBlur={() => setFieldTouched(name, true)}
        {...rest}
      />
      {inputTouched &&
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
}

FormikInput.defaultProps = {
  required: false,
  autoComplete: 'none',
  type: 'text',
}
