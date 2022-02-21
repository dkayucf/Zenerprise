import axios from '../../api'

/*
//-- Private Authentication APIS --  /apix
*/
const profile = async () => {
  const response = await axios.get('/apix/users/profile')

  return response.data
}

const updateName = async (values) => {
  const response = await axios.put('/apix/users/name', values)

  return response.data
}

const updateAddress = async (values) => {
  const response = await axios.put('/apix/users/address', values)

  return response.data
}

const addEmail = async (values) => {
  const response = await axios.post('/apix/users/email', values)

  return response.data
}

const updatePrimaryPhone = async (values) => {
  const response = await axios.put('/apix/users/primary-phone', values)

  return response.data
}

const updatePassword = async (values) => {
  const response = await axios.put('/apix/users/update-password', values)

  return response.data
}

export default {
  updateName,
  updateAddress,
  updatePrimaryPhone,
  updatePassword,
  addEmail,
  profile,
}
