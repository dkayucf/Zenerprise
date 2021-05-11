import React from 'react'
import ForgotPassword from '../../../common/authentication/ForgotPassword'
import { useRouter } from '../../../hooks/useRouter'

const ForgotPasswordPage = () => {
  const { query } = useRouter()
  console.log(query)
  return <ForgotPassword />
}

export default ForgotPasswordPage
