import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@material-ui/core'
import { useAuth } from '../../../contexts/provideAuth'
import { usePersonalInfo } from '../context/personalInfo'
import Accordion from '../Accordion'
import AddressForm from './AddressForm'
import PhoneForm from './PhoneForm'
import EmailForm from './EmailForm'
import { LinkRouter } from '../../../common/RouterLink'
import { prop, compose, filter, head, propOr, pick } from 'ramda'

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

const AddressDisplayValue = ({
  country,
  addressLineOne,
  addressLineTwo,
  city,
  state,
  postalCode,
}) => {
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

AddressDisplayValue.propTypes = {
  country: PropTypes.string,
  addressLineOne: PropTypes.string,
  addressLineTwo: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  postalCode: PropTypes.string,
}

export default function ContactInfo() {
  const { user } = useAuth()
  const { updateAddress, updateEmail, updatePrimaryPhone } = usePersonalInfo()
  const primaryPhoneNumber = compose(
    head,
    filter((phone) => phone.primaryPhone),
    propOr([], 'phoneNumbers')
  )(user)

  const initialAddress = {
    addressLineOne: '',
    addressLineTwo: '',
    city: '',
    state: '',
    postalCode: '',
    country: {
      code: 'US',
      label: 'United States',
    },
  }

  const hasAddress = user.addresses && user.addresses.length > 0
  const address = hasAddress ? head(prop('addresses', user)) : initialAddress
  const email = prop('email', user)

  const [expanded, setExpanded] = useState(false)

  const handleAccordion = useCallback(
    (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false)
    },
    []
  )

  return (
    <Box mt={5}>
      <Box pl={2}>
        <Typography variant="h4">Contact Info</Typography>
      </Box>
      <Box mt={2}>
        <Accordion
          label="Address"
          displayValue={
            hasAddress ? <AddressDisplayValue {...address} /> : '--'
          }
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
          displayValue={<Typography variant="body1">{email}</Typography>}
          initialValues={pick(['email'], user)}
          lastAccordion
          handleAccordion={handleAccordion('Email')}
          expanded={expanded === 'Email'}
          handleSubmit={updateEmail}
        >
          <EmailForm />
        </Accordion>
      </Box>
    </Box>
  )
}
