import React, { useCallback, useState } from 'react'
import { Box, Typography } from '@material-ui/core'
import { useAuth } from '../../../contexts/provideAuth'
import { usePersonalInfo } from '../context/personalInfo'
import Accordion from '../Accordion'
import NameForm from './NameForm'
import { prop } from 'ramda'

export default function BasicInfo() {
  const { user } = useAuth()
  const { updateName } = usePersonalInfo()
  const initialNameValues = {
    firstName: '',
    lastName: '',
  }
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
          displayValue="**********"
          initialValues={initialNameValues}
          lastAccordion
          handleAccordion={handleAccordion('Password')}
          expanded={expanded === 'Password'}
        >
          <NameForm />
        </Accordion>
      </Box>
    </Box>
  )
}