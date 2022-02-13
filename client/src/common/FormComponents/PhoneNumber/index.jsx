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
        error && touched
          ? `1px solid ${theme.palette.error.main}`
          : '1px solid #CACACA',
    },
    '&&:focus .special-label': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
    },
    '&&.form-control:focus': {
      borderColor:
        error && touched
          ? theme.palette.error.main
          : theme.palette.primary.main,
      boxShadow:
        error && touched
          ? `0 0 0 1px ${theme.palette.error.main}`
          : `0 0 0 1px ${theme.palette.primary.main}`,
    },
    '&&.form-control:hover': {
      borderColor:
        error && touched
          ? theme.palette.error.main
          : theme.palette.primary.main,
    },
    '&&.selected-flag:hover': {
      backgroundColor: 'red',
      zIndex: 99999,
    },
  }),
  countryButton: () => ({
    '&&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      zIndex: 99999,
    },
    '& .selected-flag:focus': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      zIndex: 99999,
    },
  }),
  container: ({ error, touched, isFocused }) => ({
    '& .special-label': {
      fontSize: 12,
      left: 15,
      color:
        error && touched
          ? theme.palette.error.main
          : isFocused
          ? theme.palette.primary.main
          : theme.palette.text.secondary,
    },
  }),
}))

const PhoneInputField = ({ children, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)
  const { required, autofocus, onValueChange } = props
  const [field, meta] = useField(props)
  const { setFieldValue, setFieldTouched } = useFormikContext()

  const { name, value } = field
  const { error, touched } = meta

  const classes = useStyles({ error, touched, isFocused })
  const toggleFocus = useCallback(() => setIsFocused((prev) => !prev), [])
  const handleBlur = useCallback(() => {
    setIsFocused((prev) => !prev)
    setFieldTouched(name, true)
  }, [setFieldTouched, name])

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
      <Box
        display="inline-flex"
        width="100%"
        position="relative"
        alignItems="center"
      >
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
          buttonClass={classes.countryButton}
          containerClass={classes.container}
          inputClass={classes.phoneInput}
          inputStyle={{ width: '100%' }}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={toggleFocus}
          onBlur={handleBlur}
          country="us"
        />
        {children}
      </Box>
      {touched && error && (
        <FormHelperText error={error && touched}>{error}</FormHelperText>
      )}
    </Box>
  )
}

PhoneInputField.propTypes = {
  autofocus: PropTypes.bool,
  required: PropTypes.bool,
  onValueChange: PropTypes.func,
  children: PropTypes.node,
}

export default PhoneInputField
