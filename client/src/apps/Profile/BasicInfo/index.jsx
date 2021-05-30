import React, { useCallback, useState } from 'react'
import { Box, Typography } from '@material-ui/core'
import { useAuth } from '../../../contexts/auth'
import { usePersonalInfo } from '../context/personalInfo'
import Accordion from '../Accordion'
import NameForm from './NameForm'
import PasswordForm from './PasswordForm'
import { prop } from 'ramda'

const initialValues = {
  oldPassword: '',
  password: '',
  confirmPassword: '',
}

export default function BasicInfo() {
  const { user } = useAuth()
  const { updateName, updatePassword } = usePersonalInfo()
  const { firstName, lastName, fullName } = prop('name', user)

  const [expanded, setExpanded] = useState(false)

  const handleAccordion = useCallback(
    (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false)
    },
    []
  )

  return (
    <Box mt={2}>
      <Box pl={2}>
        <Typography variant="h4">Basic Info</Typography>
      </Box>
      <Box mt={2}>
        <Accordion
          label="Name"
          displayValue={
            <Typography variant="body1">{fullName || '--'}</Typography>
          }
          initialValues={{ firstName, lastName }}
          handleAccordion={handleAccordion('Name')}
          expanded={expanded === 'Name'}
          handleSubmit={updateName}
        >
          <NameForm />
        </Accordion>
        <Accordion
          label="Password"
          displayValue=""
          initialValues={initialValues}
          lastAccordion
          handleAccordion={handleAccordion('Password')}
          expanded={expanded === 'Password'}
          handleSubmit={updatePassword}
        >
          <PasswordForm />
        </Accordion>
      </Box>
    </Box>
  )
}
