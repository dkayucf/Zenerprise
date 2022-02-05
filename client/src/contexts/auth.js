import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import PropTypes from 'prop-types'
import { useAsync } from '../hooks/useAsync'
import { useCookie } from '../hooks/useCookie'
import { useRouter } from '../hooks/useRouter'
import Auth from './requests/auth.js'

const defaultObj = {
  user: {
    isAuth: false,
    routes: [],
  },
}

const authContext = createContext({
  ...defaultObj,
  profile: {},
  signup: () => {},
  login: () => {},
  logout: () => {},
  getProfile: () => {},
  setProfile: () => {},
  validateEmail: () => {},
  validatePhone: () => {},
  resetPhoneValidate: () => {},
  resetEmailValidate: () => {},
  sendPasswordResetEmail: () => {},
  setUser: () => {},
  loginStatus: {},
  logoutStatus: {},
  signUpStatus: {},
  profileStatus: {},
  validateEmailRequest: {},
  validatePhoneRequest: {},
})

const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

ProvideAuth.propTypes = {
  children: PropTypes.node,
}

const useProvideAuth = () => {
  const { push, replace } = useRouter()
  const [profile, setProfile] = useState(null)
  const [loginRequest, submitLogin, resetLogin] = useAsync(Auth.login)
  const [signupRequest, submitSignup, resetSignup] = useAsync(Auth.signup)
  const [logoutRequest, submitLogout, resetLogout] = useAsync(Auth.logout)
  const [profileRequest, submitProfileGet, resetProfileRequest] = useAsync(
    Auth.profile
  )
  const [validateEmailRequest, submitValidateEmail, resetEmailValidate] =
    useAsync(Auth.validateUser)
  const [validatePhoneRequest, submitValidatePhone, resetPhoneValidate] =
    useAsync(Auth.validateUser)
  // const [
  //   passwordResetRequest,
  //   submitPasswordResetEmail,
  //   resetPasswordResetEmail,
  // ] = useAsync(Auth.passwordResetEmail)
  const { sessionCookie, setSessionCookie, removeCookie } = useCookie()
  const [user, setUser] = useState(sessionCookie.user)

  const validateEmail = async (value) => {
    if (value) {
      const { isValidUser } = await submitValidateEmail({ email: value })
      return isValidUser
    }
  }

  const validatePhone = async (value) => {
    if (value) {
      const { isValidUser } = await submitValidatePhone({ phone: value })
      return isValidUser
    }
  }

  const signup = async (values) => {
    const user = await submitSignup(values)
    if (user) {
      setUser(user)
      setSessionCookie({ user })
      resetSignup()
      push('/auth/dashboard')
    }
  }
  const login = async (values) => {
    const user = await submitLogin(values)
    if (user) {
      setUser(user)
      setSessionCookie({ user })
      resetLogin()
      push('/auth/dashboard')
    }
  }
  const logout = async () => {
    const isLoggedOut = submitLogout()
    if (isLoggedOut) {
      setUser(defaultObj)
      resetLogin()
      resetSignup()
      resetLogout()
      setProfile(null)
      removeCookie()
      replace('/')
    }
  }

  const sendPasswordResetEmail = async () => {
    //TODO: FINISH
    // const response = await submitPasswordResetEmail(email)
    return
  }

  const getProfile = useCallback(async () => {
    const response = await submitProfileGet()
    setProfile(response)
    resetProfileRequest()
  }, [resetProfileRequest, submitProfileGet])

  useEffect(() => {
    if (user?.isAuth) {
      getProfile()
    }
  }, [user, submitProfileGet, resetProfileRequest, getProfile])
  // console.log(profileRequest)
  // const sendPasswordResetEmail = async (email, cb) => {
  //   head(
  //     await makeRequest({
  //       url: '/users/forgot-password',
  //       method: 'PUT',
  //       data: email,
  //     })
  //   )

  //   if (prop('email', email)) {
  //     cb(prop('email', email))
  //   }

  //   return {}
  // }
  // console.log(user)
  // Return the user object and auth methods
  return {
    profile,
    user,
    setUser,
    login,
    signup,
    logout,
    getProfile,
    setProfile,
    validateEmail,
    validatePhone,
    resetEmailValidate,
    resetPhoneValidate,
    sendPasswordResetEmail,
    loginStatus: loginRequest.status,
    logoutStatus: logoutRequest.status,
    signUpStatus: signupRequest.status,
    profileStatus: profileRequest.status,
    validateEmailRequest,
    validatePhoneRequest,
  }
}

export const useAuth = () => useContext(authContext)
export default ProvideAuth
