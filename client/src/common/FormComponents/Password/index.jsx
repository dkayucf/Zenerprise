import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useFormikContext } from 'formik'
import {
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Visibility, VisibilityOff } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  label: ({ focused, isLogin }) => ({
    color: !focused && isLogin && theme.palette.text.primary,
    opacity: !focused && isLogin && 0.42,
  }),
}))

export default function Password({ isLogin, autoComplete, name, label }) {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocus] = useState(false)
  const classes = useStyles({ focused, isLogin })
  const {
    values,
    handleChange,
    touched,
    errors,
    setFieldTouched,
  } = useFormikContext()

  const handleShowPassword = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  )

  const toggleFocus = useCallback(() => setFocus((prev) => !prev), [])
  const handleBlur = useCallback(() => {
    setFieldTouched(name, true)
    setFocus((prev) => !prev)
  }, [name, setFieldTouched])

  const touchedInput = touched[name]
  const passwordErrors = errors[name]
  const hasErrors = passwordErrors && passwordErrors.length > 0

  return (
    <FormControl
      variant="outlined"
      error={touchedInput && hasErrors}
      fullWidth
      margin="normal"
    >
      <InputLabel className={classes.label} htmlFor={name} required>
        {label}
      </InputLabel>
      <OutlinedInput
        autoComplete={autoComplete}
        label={label}
        required
        id={name}
        type={showPassword ? 'text' : 'password'}
        value={values[name]}
        name={name}
        placeholder={isLogin && label}
        onFocus={toggleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleShowPassword}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      {!isLogin &&
        (focused || touchedInput) &&
        hasErrors &&
        passwordErrors.map((error, i) => (
          <FormHelperText key={i} id={`${name}-error-text-${i}`}>
            {error}
          </FormHelperText>
        ))}
    </FormControl>
  )
}

Password.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  isLogin: PropTypes.bool,
  autoComplete: PropTypes.string,
}

Password.defaultProps = {
  autoComplete: 'none',
  isLogin: false,
}
