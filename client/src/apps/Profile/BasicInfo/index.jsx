import React, { useCallback, useState } from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { useAuth } from '../../../contexts/auth'
import { useProfileInfo } from '../../../contexts/profile'
import Accordion from '../Accordion'
import NameForm from '../../../common/Profile/NameForm'
import PasswordForm from './PasswordForm'
import { prop } from 'ramda'

const initialValues = {
  oldPassword: '',
  password: '',
  confirmPassword: '',
}

export default function BasicInfo() {
  const { profile } = useAuth()
  const { handleUpdateName, handleUpdatePassword } = useProfileInfo()
  const { firstName, lastName, fullName } = prop('name', profile)

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
          handleSubmit={handleUpdateName}
        >
          <Grid container>
            <NameForm />
          </Grid>
        </Accordion>
        <Accordion
          label="Password"
          displayValue=""
          initialValues={initialValues}
          lastAccordion
          handleAccordion={handleAccordion('Password')}
          expanded={expanded === 'Password'}
          handleSubmit={handleUpdatePassword}
        >
          <PasswordForm />
        </Accordion>
      </Box>
    </Box>
  )
}
