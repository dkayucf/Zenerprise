import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useFormikContext } from 'formik'
import yup from '../helpers/yupMethods'
import styled from '@emotion/styled'
import {
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { Visibility, VisibilityOff, HelpOutline } from '@mui/icons-material'

const passwordSchema = yup.object({
  password: yup
    .string('Enter your password')
    .min(8, ' - Must be 8 characters or longer')
    .test('has-lowercase-letter', ' - Include a lowercase letter', (value) =>
      /^(?=.*[a-z])/.test(value)
    )
    .test('has-uppercase-letter', ' - Include a uppercase letter', (value) =>
      /^(?=.*[A-Z])/.test(value)
    )
    .test('has-digit', ' - Include a digit', (value) =>
      /^(?=.*[0-9])/.test(value)
    )
    .test('has-special-char', ' - Include a special character', (value) =>
      /^(?=.*[!@#$%^&*])/.test(value)
    ),
})

const validatePassword = (value) => {
  try {
    passwordSchema.validateSync(value, {
      abortEarly: false,
    })
  } catch (e) {
    return e.errors
  }
}

const useStyles = makeStyles((theme) => ({
  label: ({ focused, isLogin }) => ({
    color: !focused && isLogin && theme.palette.text.primary,
    opacity: !focused && isLogin && 0.42,
  }),
}))

const StyledAccordion = styled(Accordion)`
  &&.MuiAccordion-root {
    &.Mui-expanded {
      margin-top: 0;
    }
    &::before {
      display: none;
    }
  }
`

const StyledAccordionSummary = styled(AccordionSummary)`
  &&.MuiAccordionSummary-root {
    min-height: 0;
    border-radius: 0 0 5px 5px;
    & > .Mui-expanded {
      margin-top: 0;
    }
    & > .MuiAccordionSummary-content {
      margin-top: 4px;
      margin-bottom: 0;
      padding-top: 4px;
      padding-bottom: 4px;
    }
  }
`

const PasswordHelperText = ({ passwordError, value }) => {
  const [isOpen, setOpen] = useState(false)
  let messages = [
    ' - Must be 8 characters or longer',
    ' - Include a lowercase letter',
    ' - Include a uppercase letter',
    ' - Include a digit',
    ' - Include a special character',
  ]
  const validationErrors = validatePassword(value)
  useEffect(() => {
    if (passwordError) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [passwordError])

  return (
    <StyledAccordion
      elevation={0}
      expanded={isOpen}
      onChange={() => setOpen((prev) => !prev)}
    >
      <StyledAccordionSummary>
        <Box
          fontSize="0.75rem"
          fontWeight="fontWeightLight"
          display="flex"
          alignItems="center"
        >
          Password Requirements &nbsp;
          <HelpOutline color="primary" fontSize="small" />
        </Box>
      </StyledAccordionSummary>
      <AccordionDetails>
        <Box>
          {validationErrors && validationErrors.length > 0
            ? validationErrors.map((error, i) => (
                <FormHelperText key={i} id={`helper-${i}-text`}>
                  {error}
                </FormHelperText>
              ))
            : messages.map((message, i) => (
                <FormHelperText key={i} id={`helper-${i}-text`}>
                  {message}
                </FormHelperText>
              ))}
        </Box>
      </AccordionDetails>
    </StyledAccordion>
  )
}

PasswordHelperText.propTypes = {
  value: PropTypes.object,
  passwordError: PropTypes.bool,
}

export default function Password({
  isLogin,
  autoComplete,
  name,
  label,
  validateOnChange,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocus] = useState(false)
  const classes = useStyles({ focused, isLogin })
  const { values, touched, errors, setFieldTouched, setFieldValue } =
    useFormikContext()

  const handleShowPassword = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  )

  const handleChange = (e) => {
    if (validateOnChange && !isLogin) {
      setFieldValue(name, e.target.value, true)
    } else {
      setFieldValue(name, e.target.value, false)
    }
  }

  const toggleFocus = useCallback(() => setFocus((prev) => !prev), [])
  const handleBlur = useCallback(() => {
    if (!isLogin) {
      setFieldTouched(name, true)
      setFocus((prev) => !prev)
    }
  }, [name, setFieldTouched, isLogin])

  const touchedInput = touched[name]
  const passwordError = errors[name]

  return (
    <FormControl
      variant="outlined"
      error={passwordError && touchedInput}
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
        placeholder={isLogin && label ? label : ''}
        onFocus={toggleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleShowPassword}
              edge="end"
              size="large"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      {!isLogin &&
        touchedInput &&
        passwordError &&
        name === 'confirmPassword' && (
          <FormHelperText id={`${name}-error-text`}>
            {passwordError}
          </FormHelperText>
        )}
      {!isLogin && name !== 'confirmPassword' && name !== 'oldPassword' ? (
        <PasswordHelperText
          passwordError={passwordError && touchedInput}
          value={values}
        />
      ) : null}
    </FormControl>
  )
}

Password.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  isLogin: PropTypes.bool,
  autoComplete: PropTypes.string,
  validateOnChange: PropTypes.bool,
}

Password.defaultProps = {
  autoComplete: 'none',
  isLogin: false,
  validateOnChange: true,
}
