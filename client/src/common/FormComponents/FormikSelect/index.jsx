import React from 'react'
import PropTypes from 'prop-types'
import { FastField, getIn } from 'formik'
import {
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material'
import { omit, equals } from 'ramda'

function shouldUpdate(nextProps, currentProps) {
  // Lifted from https://github.com/formium/formik/issues/1188#issuecomment-603463915
  // We want this component to re-render when its props change,
  // such as when it goes from disabled={true} to disabled={false},
  // but not when the Formik context updates
  // Modified to use Ramda to check all props instead of just a handful
  return (
    !equals(
      omit(['formik', 'children', 'options', 'shouldUpdate'], nextProps),
      omit(['formik', 'children', 'options', 'shouldUpdate'], currentProps)
    ) ||
    // We also need to re-render if the dropdown's options change
    // We can't check if the children have changed, since they won't re-render because of the other optimizations
    // So we have to pass them in separately and then compare them
    React.Children.count(nextProps.options) !==
      React.Children.count(currentProps.options) ||
    nextProps.formik.isSubmitting !== currentProps.formik.isSubmitting ||
    Object.keys(nextProps).length !== Object.keys(currentProps).length ||
    getIn(nextProps.formik.values, currentProps.name) !==
      getIn(currentProps.formik.values, currentProps.name) ||
    getIn(nextProps.formik.errors, currentProps.name) !==
      getIn(currentProps.formik.errors, currentProps.name) ||
    getIn(nextProps.formik.touched, currentProps.name) !==
      getIn(currentProps.formik.touched, currentProps.name)
  )
}

export default function FormControlSelect({
  label,
  children,
  name,
  required,
  ...props
}) {
  return (
    // FastField only re-renders when its field state (value, error state, touched, etc.) changes,
    // compared to a Field component that re-renders when any field in the form changes.
    // Using a FastField here means that the dropdown won't re-render when a user is typing into another input.
    // Since some of our dropdowns get quite large, this results in a big performance improvement
    <FastField
      name={name}
      {...props}
      options={children}
      shouldUpdate={shouldUpdate}
    >
      {({ field, meta, form }) => (
        <FormControl
          variant="outlined"
          {...props}
          error={meta.error && meta.touched}
          required={required}
        >
          <InputLabel htmlFor={field.name}>{label}</InputLabel>
          <Select
            native
            label={label}
            id={field.name}
            {...field}
            inputProps={{
              name: field.name,
              value: field.value || '',
            }}
            onChange={(e) => {
              e.persist()
              return form
                .setFieldValue(field.name, e.target.value)
                .then(() => form.handleBlur(e))
            }}
          >
            {(!required || field.value === '' || field.value === undefined) && (
              <option aria-label="None" value="" />
            )}
            {children}
          </Select>
          {meta.error && meta.touched && (
            <FormHelperText>{meta.error}</FormHelperText>
          )}
        </FormControl>
      )}
    </FastField>
  )
}

FormControlSelect.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
}
