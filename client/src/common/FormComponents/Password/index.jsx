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

export default function Password({ confirmPassword, isLogin, autoComplete }) {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocus] = useState(false)
  const classes = useStyles({ focused, isLogin })
  const { values, handleChange, touched, errors } = useFormikContext()

  const handleShowPassword = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  )

  const toggleFocus = useCallback(() => setFocus((prev) => !prev), [])

  const inputName = confirmPassword ? 'confirmPassword' : 'password'
  const inputLabel = confirmPassword ? 'Confirm Password' : 'Password'
  const touchedInput = touched[inputName]
  const passwordErrors = errors[inputName]
  const hasErrors = passwordErrors && passwordErrors.length > 0

  return (
    <FormControl
      variant="outlined"
      error={touchedInput && hasErrors}
      fullWidth
      margin="normal"
    >
      <InputLabel className={classes.label} htmlFor={inputName} required>
        {inputLabel}
      </InputLabel>
      <OutlinedInput
        autoComplete={autoComplete}
        label={inputLabel}
        required
        id={inputName}
        type={showPassword ? 'text' : 'password'}
        value={values[inputName]}
        name={inputName}
        placeholder={isLogin && inputLabel}
        onFocus={toggleFocus}
        onBlur={toggleFocus}
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
        focused &&
        hasErrors &&
        passwordErrors.map((error, i) => (
          <FormHelperText key={i} id={`${inputName}-error-text-${i}`}>
            {error}
          </FormHelperText>
        ))}
    </FormControl>
  )
}

Password.propTypes = {
  isLogin: PropTypes.bool,
  confirmPassword: PropTypes.bool,
  autoComplete: PropTypes.string,
}

Password.defaultProps = {
  autoComplete: 'none',
}
