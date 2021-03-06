import axios from '../../api'

/*
//-- Private Authentication APIS --  /apix
*/
const logout = async () => {
  const response = await axios.post('/apix/users/logout')

  return response.data
}

const profile = async () => {
  const response = await axios.get('/apix/users/profile')

  return response.data
}

/*
//-- Public Authentication APIS
*/

const validateUser = async (credentials) => {
  const response = await axios.post('/api/users/validate-user', credentials)
  return response.data
}

const login = async (credentials) => {
  const response = await axios.post('/api/users/login', credentials)

  return response.data
}

const signup = async (credentials) => {
  const response = await axios.post('/api/users/register', credentials)

  return response.data
}

const passwordResetEmail = async (credentials) => {
  const response = await axios.post('/api/users/forgot-password', credentials)

  return response.data
}

export default {
  login,
  signup,
  logout,
  validateUser,
  passwordResetEmail,
  profile,
}
