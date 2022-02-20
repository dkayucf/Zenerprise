import React, { useState, useEffect } from 'react'
import { TextField } from '@mui/material'
import PhoneNumber from '../../FormComponents/PhoneNumber'
import { useFormikContext } from 'formik'
import { test } from 'ramda'

export default function UserInput() {
  const {
    values,
    setFieldValue,
    handleChange,
    touched,
    errors,
    setFieldTouched,
  } = useFormikContext()

  const [userInputFocused, setUserFocused] = useState(false)
  const [userHasLetters, setUserHasLetters] = useState(false)

  useEffect(() => {
    const hasLetters = test(/.*[a-z].*/, values.user)
    if (values.user === '' || !hasLetters) {
      setUserHasLetters(false)
    }
  }, [values.user])

  const isEmail =
    values.user === '' || !test(/^[0-9]+$/, values.user) || userHasLetters

  const emailLabel =
    (values.user !== '' && !test(/^[0-9]+$/, values.user)) || userInputFocused
      ? {
          label: 'Email *',
        }
      : null

  const onPhoneValueChange = (phoneNumber, phoneObject, event) => {
    const nativeInputData = event.nativeEvent.data

    const isLetter = test(/[\D]/, nativeInputData)
    if (isLetter && nativeInputData) {
      setUserHasLetters(true)
      setFieldValue('phoneObject', null, false)
      setFieldValue('user', phoneNumber + nativeInputData, true)
      setUserFocused(true)
    } else {
      setFieldValue('phoneObject', phoneObject, false)
      setFieldValue('user', phoneNumber, true)
    }
  }

  const onBlur = () => {
    setUserFocused(false)
    setFieldTouched('user', true, true)
  }

  return isEmail ? (
    <TextField
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={userInputFocused}
      variant="outlined"
      margin="normal"
      autoComplete="username"
      type="email"
      fullWidth
      id="user"
      name="user"
      placeholder="Email or mobile number"
      onFocus={() => setUserFocused(true)}
      onBlur={onBlur}
      value={values.user}
      onChange={handleChange}
      error={touched.user && Boolean(errors.user)}
      helperText={touched.user && errors.user}
      {...emailLabel}
    />
  ) : (
    <PhoneNumber
      id="user"
      name="user"
      required
      autofocus={userInputFocused}
      onValueChange={onPhoneValueChange}
    />
  )
}
