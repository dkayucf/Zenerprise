import React, { useCallback, useState } from 'react'
import { Box, Typography } from '@material-ui/core'
import { useAuth } from '../../../contexts/auth'
import { useProfileInfo } from '../../../contexts/profile'
import Accordion from '../Accordion'
import AddressForm from './AddressForm'
import PhoneForm from './PhoneForm'
import EmailForm from './EmailForm'
import { prop, compose, head, propOr, find, propEq } from 'ramda'

const PhoneDisplayValue = () => {
  const { profile } = useAuth()
  const phoneNumbers = prop('phoneNumbers', profile)

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
    </Box>
  ))
}

const EmailDisplayValue = () => {
  const { profile } = useAuth()
  const emailAccounts = prop('email', profile)

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
    </Box>
  ))
}

const AddressDisplayValue = () => {
  const { profile } = useAuth()
  const addresses = prop('addresses', profile)

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
  const { profile } = useAuth()

  const { handleUpdateAddress, handleUpdateEmail, handleUpdatePrimaryPhone } =
    useProfileInfo()
  const [expanded, setExpanded] = useState(false)

  const handleAccordion = useCallback(
    (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false)
    },
    []
  )

  const primaryPhoneNumber = compose(
    find(propEq('primaryPhone', true)),
    propOr([], 'phoneNumbers')
  )(profile)

  const email = prop('email', profile)
  const hasAddress = profile?.addresses && profile?.addresses?.length > 0
  const address = hasAddress ? head(prop('addresses', profile)) : initialAddress

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
          handleSubmit={handleUpdateAddress}
        >
          <AddressForm />
        </Accordion>
        <Accordion
          label="Phone Number"
          displayValue={<PhoneDisplayValue />}
          initialValues={primaryPhoneNumber}
          handleAccordion={handleAccordion('Phone Number')}
          expanded={expanded === 'Phone Number'}
          handleSubmit={handleUpdatePrimaryPhone}
        >
          <PhoneForm />
        </Accordion>
        <Accordion
          label="Email"
          name="emails"
          displayValue={<EmailDisplayValue />}
          initialValues={{
            emails: email,
          }}
          lastAccordion
          handleAccordion={handleAccordion('Email')}
          expanded={expanded === 'Email'}
          handleSubmit={handleUpdateEmail}
          validateOnChange={false}
        >
          <EmailForm />
        </Accordion>
      </Box>
    </Box>
  )
}
