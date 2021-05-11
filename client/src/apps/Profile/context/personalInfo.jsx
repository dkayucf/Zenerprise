import React, { useContext, createContext, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { path } from 'ramda'
import { useApiRequest } from '../../../hooks/useApi'
import { useCookie } from '../../../hooks/useCookie'
import { useAuth } from '../../../contexts/provideAuth'

const PersonalInfoContext = createContext({
  updateName: () => {},
  updateAddress: () => {},
  updateEmail: () => {},
  updatePrimaryPhone: () => {},
})

const PersonalInfoProvider = ({ children }) => {
  const { isAuth, setUser } = useAuth()
  const { setSessionCookie } = useCookie()
  const nameKey = 'updatedName'
  const addressKey = 'updatedAddress'
  const emailKey = 'updatedEmail'
  const primaryPhoneKey = 'updatedPrimaryPhone'
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
      }
    },
    [makeRequest, setSessionCookie, setUser]
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
      }
    },
    [makeRequest, setSessionCookie, setUser]
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
      }
    },
    [makeRequest, setSessionCookie, setUser]
  )

  const updatePrimaryPhone = useCallback(
    async (values, resetForm) => {
      console.log(values)
      const response = await makeRequest({
        url: '/users/primary-phone',
        method: 'PUT',
        requestKey: primaryPhoneKey,
        data: values,
      })

      // const user = path([primaryPhoneKey, 'user'], response)
      // if (user) {
      //   resetForm()
      //   setSessionCookie(response[primaryPhoneKey])
      //   setUser(user)
      // }
    },
    [makeRequest, setSessionCookie, setUser]
  )

  const memoizedValue = useMemo(
    () => ({ updateName, updateAddress, updateEmail, updatePrimaryPhone }),
    [updateName, updateAddress, updateEmail, updatePrimaryPhone]
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
