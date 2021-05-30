import React, { useCallback, useState } from 'react'
import { Box, Typography } from '@material-ui/core'
import { useAuth } from '../../../contexts/auth'
import { usePersonalInfo } from '../context/personalInfo'
import Accordion from '../Accordion'
import AddressForm from './AddressForm'
import PhoneForm from './PhoneForm'
import EmailForm from './EmailForm'
import { LinkRouter } from '../../../common/RouterLink'
import { prop, compose, filter, head, propOr } from 'ramda'

const PhoneDisplayValue = () => {
  const { user } = useAuth()
  const phoneNumbers = prop('phoneNumbers', user)

  if (!phoneNumbers || !phoneNumbers.length) {
    return '--'
  }

  return phoneNumbers.map((phone, index) => (
    <Box key={index} display="flex" alignItems="baseline">
      <Box mr={1}>
        <Typography variant="body1">{phone.phoneFormatted}</Typography>
        <Typography variant="caption">
          {phone.primaryPhone ? ' (Primary Phone)' : ''}
        </Typography>
      </Box>
      {phoneNumbers.length > 1 ? <LinkRouter to="">More...</LinkRouter> : null}
    </Box>
  ))
}

const EmailDisplayValue = () => {
  const { user } = useAuth()
  const emailAccounts = prop('email', user)

  if (!emailAccounts || !emailAccounts.length) {
    return '--'
  }

  return emailAccounts.map((email, index) => (
    <Box key={index} display="flex" alignItems="baseline">
      {email.primaryEmail ? (
        <Box mr={1}>
          <Typography variant="body1">{email.email}</Typography>
          <Typography variant="caption">
            {email.primaryEmail ? ' (Primary Email)' : ''}
          </Typography>
        </Box>
      ) : null}
      {emailAccounts.length > 1 ? <LinkRouter to="">More...</LinkRouter> : null}
    </Box>
  ))
}

const AddressDisplayValue = () => {
  const { user } = useAuth()
  const addresses = prop('addresses', user)

  if (!addresses || !addresses.length) {
    return '--'
  }

  const { country, addressLineOne, addressLineTwo, city, state, postalCode } =
    head(addresses)
  const { label } = country

  return (
    <Box display="flex" alignItems="baseline">
      <Box mr={1}>
        <Typography variant="body1">{addressLineOne}</Typography>
        {addressLineTwo !== '' ? (
          <Typography variant="body1">{addressLineTwo}</Typography>
        ) : null}
        <Typography variant="body1">{`${city}, ${state.value}, ${postalCode}`}</Typography>
        <Typography variant="body1">{label}</Typography>
      </Box>
    </Box>
  )
}

const initialAddress = {
  addressLineOne: '',
  addressLineTwo: '',
  city: '',
  state: null,
  postalCode: '',
  country: {
    code: 'US',
    label: 'United States',
  },
}

export default function ContactInfo() {
  const { user } = useAuth()
  const { updateAddress, updateEmail, updatePrimaryPhone } = usePersonalInfo()
  const primaryPhoneNumber = compose(
    head,
    filter((phone) => phone.primaryPhone),
    propOr([], 'phoneNumbers')
  )(user)

  const email = prop('email', user)

  const hasAddress = user.addresses && user.addresses.length > 0
  const address = hasAddress ? head(prop('addresses', user)) : initialAddress

  const [expanded, setExpanded] = useState(false)

  const handleAccordion = useCallback(
    (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false)
    },
    []
  )

  const handleAddAction = (initialValues) => (pushFn) => pushFn(initialValues)

  return (
    <Box mt={5}>
      <Box pl={2}>
        <Typography variant="h4">Contact Info</Typography>
      </Box>
      <Box mt={2}>
        <Accordion
          label="Address"
          displayValue={<AddressDisplayValue />}
          initialValues={address}
          handleAccordion={handleAccordion('Address')}
          expanded={expanded === 'Address'}
          handleSubmit={updateAddress}
        >
          <AddressForm />
        </Accordion>
        <Accordion
          label="Phone Number"
          displayValue={<PhoneDisplayValue />}
          initialValues={primaryPhoneNumber}
          handleAccordion={handleAccordion('Phone Number')}
          expanded={expanded === 'Phone Number'}
          handleSubmit={updatePrimaryPhone}
        >
          <PhoneForm />
        </Accordion>
        <Accordion
          label="Email"
          name="emails"
          displayValue={<EmailDisplayValue />}
          initialValues={{ emails: email }}
          lastAccordion
          handleAccordion={handleAccordion('Email')}
          expanded={expanded === 'Email'}
          handleSubmit={updateEmail}
          handleAddAction={handleAddAction({ email: '', primaryEmail: false })}
        >
          <EmailForm />
        </Accordion>
      </Box>
    </Box>
  )
}
