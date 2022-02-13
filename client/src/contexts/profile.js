import React, { useContext, createContext } from 'react'
import PropTypes from 'prop-types'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from './auth'
import { useSnackbar } from './snackbar'
import Profile from './requests/profile'

const ProfileInfoContext = createContext({
  addEmailStatus: 'idle',
  updateAddressStatus: 'idle',
  updateNameStatus: 'idle',
  updatePasswordStatus: 'idle',
  updatePrimaryPhoneStatus: 'idle',
  handleUpdateName: () => {},
  handleUpdateAddress: () => {},
  handleUpdateEmail: () => {},
  handleUpdatePrimaryPhone: () => {},
  handleUpdatePassword: () => {},
  handleAddEmail: () => {},
})

const ProfileInfoProvider = ({ children }) => {
  const handleSnackbar = useSnackbar()
  const { setProfile } = useAuth()
  const [addEmailRequest, addEmail, resetAddEmail] = useAsync(Profile.addEmail)
  const [updateAddressRequest, updateAddress, resetUpdateAddress] = useAsync(
    Profile.updateAddress
  )
  const [updateNameRequest, updateName, resetUpdateName] = useAsync(
    Profile.updateName
  )
  const [updatePasswordRequest, updatePassword, resetUpdatePassword] = useAsync(
    Profile.updatePassword
  )
  const [
    updatePrimaryPhoneRequest,
    updatePrimaryPhone,
    resetUpdatePrimaryPhone,
  ] = useAsync(Profile.updatePrimaryPhone)

  const handleUpdateName = async (values) => {
    const response = await updateName(values)
    if (response) {
      setProfile(response)
      resetUpdateName()
      handleSnackbar('Name updated successfully', 'success')
    }
  }

  const handleUpdateAddress = async (values) => {
    const response = await updateAddress(values)
    if (response) {
      setProfile(response)
      resetUpdateAddress()
      handleSnackbar('Address updated successfully', 'success')
    }
  }

  const handleAddEmail = async (values) => {
    const response = await addEmail(values)
    if (response) {
      setProfile(response)
      resetAddEmail()
      handleSnackbar('Email updated successfully', 'success')
    }
  }

  const handleUpdatePrimaryPhone = async (values) => {
    const response = await updatePrimaryPhone(values)
    if (response) {
      setProfile(response)
      resetUpdatePrimaryPhone()
      handleSnackbar('Phone number updated successfully', 'success')
    }
  }

  //TODO: FINISH THIS FUNCTION
  const handleUpdateEmail = () => {}

  const handleUpdatePassword = async (values) => {
    const response = await updatePassword(values)
    if (response) {
      setProfile(response)
      resetUpdatePassword()
      handleSnackbar('Password updated successfully', 'success')
    }
  }

  const values = {
    addEmailStatus: addEmailRequest.status,
    updateAddressStatus: updateAddressRequest.status,
    updateNameStatus: updateNameRequest.status,
    updatePasswordStatus: updatePasswordRequest.status,
    updatePrimaryPhoneStatus: updatePrimaryPhoneRequest.status,
    handleUpdateName,
    handleUpdateAddress,
    handleUpdateEmail,
    handleUpdatePrimaryPhone,
    handleUpdatePassword,
    handleAddEmail,
  }

  return (
    <ProfileInfoContext.Provider value={values}>
      {children}
    </ProfileInfoContext.Provider>
  )
}

ProfileInfoProvider.propTypes = {
  children: PropTypes.node,
}

export const useProfileInfo = () => useContext(ProfileInfoContext)
export default ProfileInfoProvider
