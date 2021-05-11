import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import { useField, useFormikContext } from 'formik'
import { Box, FormHelperText } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  phoneInput: ({ error, touched }) => ({
    '&&': {
      border:
        touched && Boolean(error)
          ? `1px solid ${theme.palette.error.main}`
          : '1px solid #CACACA',
    },
    '&&:focus .special-label': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
    },
  }),
  container: ({ error, touched, isFocused }) => ({
    '& .special-label': {
      fontSize: 12,
      left: 15,
      color:
        touched && Boolean(error)
          ? theme.palette.error.main
          : isFocused
          ? theme.palette.primary.main
          : theme.palette.text.secondary,
    },
  }),
}))

const PhoneInputField = ({ ...props }) => {
  const [isFocused, setIsFocused] = useState(false)
  const { required, autofocus, onValueChange } = props
  const [field, meta] = useField(props)
  const { setFieldValue } = useFormikContext()

  const { name, value } = field
  const { error, touched } = meta

  const classes = useStyles({ error, touched, isFocused })
  const toggleFocus = useCallback(() => setIsFocused((prev) => !prev), [])

  const onChange = useCallback(
    (value, phoneData, event, formattedValue) => {
      if (onValueChange) {
        onValueChange(value, phoneData, event)
      } else {
        field.onChange(name)(value)
        setFieldValue('phoneData', phoneData, false)
        setFieldValue('phoneFormatted', formattedValue, false)
      }
    },
    [field, name, onValueChange, setFieldValue]
  )

  return (
    <Box>
      <PhoneInput
        inputProps={{
          name: name,
          type: 'tel',
          autoFocus: autofocus,
          autoComplete: 'none',
        }}
        disableCountryGuess={true}
        disableAreaCodes
        enableSearch
        specialLabel={required ? 'Phone *' : 'Phone'}
        placeholder="Enter phone number"
        containerStyle={{ marginTop: 16, marginBottom: 8 }}
        containerClass={classes.container}
        inputClass={classes.phoneInput}
        inputStyle={{ width: '100%' }}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={toggleFocus}
        onBlur={toggleFocus}
        country="us"
      />
      <FormHelperText error={touched && Boolean(error)}>
        {touched && error}
      </FormHelperText>
    </Box>
  )
}

PhoneInputField.propTypes = {
  autofocus: PropTypes.bool,
  required: PropTypes.bool,
  onValueChange: PropTypes.func,
}

export default PhoneInputField
