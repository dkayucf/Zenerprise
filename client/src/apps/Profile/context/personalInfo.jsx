import React, { useContext, createContext, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { path } from 'ramda'
import { useApiRequest } from '../../../hooks/useApi'
import { useCookie } from '../../../hooks/useCookie'
import { useAuth } from '../../../contexts/auth'
import { useSnackbar } from '../../../contexts/snackbar'

const PersonalInfoContext = createContext({
  updateName: () => {},
  updateAddress: () => {},
  updateEmail: () => {},
  updatePrimaryPhone: () => {},
  updatePassword: () => {},
})

const PersonalInfoProvider = ({ children }) => {
  const handleSnackbar = useSnackbar()
  const { isAuth, setUser } = useAuth()
  const { setSessionCookie } = useCookie()
  const nameKey = 'updatedName'
  const addressKey = 'updatedAddress'
  const emailKey = 'updatedEmail'
  const primaryPhoneKey = 'updatedPrimaryPhone'
  const passwordKey = 'updatePassword'
  const { makeRequest } = useApiRequest([nameKey], isAuth)

  const updateName = useCallback(
    async (values, resetForm) => {
      const response = await makeRequest({
        url: '/users/name',
        method: 'PUT',
        requestKey: nameKey,
        data: values,
      })

      const user = path([nameKey, 'user'], response)
      if (user) {
        resetForm()
        setSessionCookie(response[nameKey])
        setUser(user)
        handleSnackbar('Name updated successfully', 'success')
      }
    },
    [makeRequest, setSessionCookie, setUser, handleSnackbar]
  )

  const updateAddress = useCallback(
    async (values, resetForm) => {
      const response = await makeRequest({
        url: '/users/address',
        method: 'PUT',
        requestKey: addressKey,
        data: values,
      })

      const user = path([addressKey, 'user'], response)
      if (user) {
        resetForm()
        setSessionCookie(response[addressKey])
        setUser(user)
        handleSnackbar('Address updated successfully', 'success')
      }
    },
    [makeRequest, setSessionCookie, setUser, handleSnackbar]
  )

  const updateEmail = useCallback(
    async (values, resetForm) => {
      const response = await makeRequest({
        url: '/users/email',
        method: 'PUT',
        requestKey: emailKey,
        data: values,
      })

      const user = path([emailKey, 'user'], response)
      if (user) {
        resetForm()
        setSessionCookie(response[emailKey])
        setUser(user)
        handleSnackbar('Email updated successfully', 'success')
      }
    },
    [makeRequest, setSessionCookie, setUser, handleSnackbar]
  )

  const updatePrimaryPhone = useCallback(
    async (values, resetForm) => {
      const response = await makeRequest({
        url: '/users/primary-phone',
        method: 'PUT',
        requestKey: primaryPhoneKey,
        data: values,
      })

      const user = path([primaryPhoneKey, 'user'], response)
      if (user) {
        resetForm()
        setSessionCookie(response[primaryPhoneKey])
        setUser(user)
        handleSnackbar('Phone number updated successfully', 'success')
      }
    },
    [makeRequest, setSessionCookie, setUser, handleSnackbar]
  )

  const updatePassword = useCallback(
    async (values, resetForm) => {
      const initialValues = {
        oldPassword: '',
        password: '',
        confirmPassword: '',
      }
      const response = await makeRequest({
        url: '/users/update-password',
        method: 'PUT',
        requestKey: passwordKey,
        data: values,
      })

      const user = path([passwordKey, 'user'], response)

      if (user) {
        resetForm(initialValues)
        setSessionCookie(response[passwordKey])
        setUser(user)
        handleSnackbar('Password updated successfully', 'success')
      }
    },
    [makeRequest, setSessionCookie, setUser, handleSnackbar]
  )

  const memoizedValue = useMemo(
    () => ({
      updateName,
      updateAddress,
      updateEmail,
      updatePrimaryPhone,
      updatePassword,
    }),
    [updateName, updateAddress, updateEmail, updatePrimaryPhone, updatePassword]
  )
  return (
    <PersonalInfoContext.Provider value={memoizedValue}>
      {children}
    </PersonalInfoContext.Provider>
  )
}

PersonalInfoProvider.propTypes = {
  children: PropTypes.node,
}

export const usePersonalInfo = () => useContext(PersonalInfoContext)
export default PersonalInfoProvider
