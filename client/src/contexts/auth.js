import React, { useContext, createContext, useState, useEffect, useCallback } from "react"
import PropTypes from 'prop-types'
import { useApiRequest } from '../hooks/useApi'
import { useCookie } from '../hooks/useCookie'
import { head, propOr, prop, pathOr } from 'ramda'

const defaultObj = {
  isAuth: false,
  user: null,
  routes: []
}

const authContext = createContext({
  ...defaultObj,
  signup: () => {},
  login: () => {},
  logout: () => {},
  validateUser: () => {},
  resetLoginRequest: () => {},
  resetSignupRequest: () => {},
  resetPhoneValidate: () => {},
  resetEmailValidate: () => {},
  sendPasswordResetEmail: () => {},
  setUser: () => {},
  loginStatus: {},
  logoutStatus: {},
  signUpStatus: {},
  useResource: {}
})

const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth()
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
}

ProvideAuth.propTypes = {
    children: PropTypes.node
  }
  
const useProvideAuth = () => {
    const loginKey = 'login'
    const signupKey = 'signup'
    const logoutKey = 'logout'
    const { sessionCookie, setSessionCookie, removeCookie } = useCookie()
    const [user, setUser] = useState(sessionCookie.user)
    const [isAuth, setIsAuth] = useState(sessionCookie.isAuth)
    const [routes, setRoutes] = useState(sessionCookie.routes)
    const { makeRequest, resetRequest, useResource } = useApiRequest([loginKey, signupKey, logoutKey, 'email', 'phone'], isAuth)

    useEffect(() => {
      setSessionCookie(sessionCookie)
    }, [sessionCookie, setSessionCookie])

    const validateUser = (type) => async (value) => {
      if (value) {
        const { isValidUser } = propOr({ isValidUser: false }, type, await makeRequest({
          url: '/users/validate-user',
          method: 'POST',
          requestKey: type,
          data: {
            [type]: value
          }
        }))
        return isValidUser
      }
    }
    
    const signup = async(values, cb) => {
      const { isAuth, user, routes } = propOr(defaultObj, signupKey, await makeRequest({
        url: '/users/register',
        method: 'POST',
        requestKey: signupKey,
        data: values
      }))

      if (isAuth) {
        setUser(user)
        setIsAuth(isAuth)
        setRoutes(routes)
        setSessionCookie({ user, isAuth, routes })
        cb()
        resetRequest(signupKey)
      } 
    }

    const login = async (values, cb) => {
      const { isAuth, user, routes } = propOr(defaultObj, loginKey, await makeRequest({
        url: '/users/login',
        method: 'POST',
        data: values,
        requestKey: loginKey
      }))

      if (isAuth) {
        setRoutes(routes)
        setUser(user)
        setIsAuth(isAuth)
        setSessionCookie({ user, isAuth, routes })
        cb()
        resetRequest(loginKey)
      } 
    }

      const logout = async (cb) => {
        const success = pathOr(false, [logoutKey, 'success'], await makeRequest({
          url: '/users/logout',
          method: 'POST',
          requestKey: logoutKey
        }))

        if (success) {
          setIsAuth(false)
          setUser(null)
          resetRequest(signupKey)
          resetRequest(loginKey)
          resetRequest(logoutKey)
          removeCookie()
          cb()
        }
      }
    
      const sendPasswordResetEmail = async (email, cb) => {
        head(await makeRequest({
          url: '/users/forgot-password',
          method: 'PUT',
          data: email
        }))

        if (prop('email', email)) {
          cb(prop('email', email))
        }
        
        return {}
      }
    
    //   const confirmPasswordReset = (code, password) => {
    //     return {}
    //   }

      const resetLoginRequest = useCallback(() => resetRequest(loginKey), [resetRequest])
      const resetSignupRequest = useCallback(() => resetRequest(signupKey), [resetRequest])
      const resetEmailValidate = useCallback(() => resetRequest('email'), [resetRequest])
      const resetPhoneValidate = useCallback(() => resetRequest('phone'), [resetRequest])
    
      // Return the user object and auth methods
      return {
        isAuth,
        routes,
        user,
        setUser,
        login,
        signup,
        logout,
        validateUser,
        resetLoginRequest,
        resetSignupRequest,
        resetEmailValidate,
        resetPhoneValidate,
        sendPasswordResetEmail,
        loginStatus: useResource(loginKey),
        logoutStatus: useResource(logoutKey),
        signUpStatus: useResource(signupKey),
        useResource
      }
}

export const useAuth = () => useContext(authContext)
export default ProvideAuth
