import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import * as yup from 'yup'
import {
  Typography,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Divider,
  Box,
  Button,
} from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import GenericForm from '../../../common/FormComponents/GenericForm'
import ActionButtons from './ActionButtons'

const Accordion = styled(MuiAccordion)`
  ${({ theme, lastAccordion }) => `
    && {
      width: 100%;
      box-shadow: none;
      border: 1px solid ${theme.palette.divider};
      border-left: 0;
      border-right: 0;
      border-bottom: ${
        lastAccordion ? `1px solid ${theme.palette.divider}` : 0
      };
    }
  `}
`

const AccordionDetails = styled(MuiAccordionDetails)`
  align-items: center;
`
const UpdateButton = styled(Button)`
  margin-left: auto;
`

const AccordionSummary = styled(MuiAccordionSummary)`
  &&.MuiAccordionSummary-root {
    min-height: 64px;
  }
  .MuiAccordionSummary-content {
    align-items: center;
    &.Mui-expanded {
      margin: 12px 0;
    }
  }
  .MuiAccordionSummary-expandIcon {
    &.Mui-expanded {
      transform: rotate(90deg);
    }
  }
`

const getValidationSchema = (label) => {
  switch (label) {
    case 'Name':
      return yup.object({
        firstName: yup
          .string('Enter your first name')
          .required('First name is required'),
        lastName: yup
          .string('Enter your last name')
          .required('Last name is required'),
      })
    case 'Password':
      return yup.object({
        password: yup
          .string('Enter your password')
          .matches(/^.{8,}$/, '8 characters or longer')
          .matches(
            /^((?=.*?[a-zA-Z])|(?=.*?[#?!@$%^&*-]))/,
            'At least 1 letter or symbol (like !@#$%^).'
          )
          .matches(
            /^((?=.*?[0-9])|(?=.*?[#?!@$%^&*-]))/,
            'At least 1 number or symbol (like !@#$%^).'
          )
          .matches(
            /^((?=.*?[0-9])|(?=.*?[a-zA-Z]))/,
            'At least 1 letter or number.'
          )
          .required('Password is required'),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password'), null], 'Passwords must match'),
      })
    case 'Phone Number':
      return yup.object({
        phone: yup
          .string('Enter your mobile phone number ')
          .required('Mobile phone number is required'),
        phoneData: yup.object({
          countryCode: yup.string(),
          dialCode: yup.string(),
          format: yup.string(),
          name: yup.string(),
        }),
        phoneFormatted: yup.string(),
      })
    case 'Email':
      return yup.object({
        email: yup
          .string('Enter your email')
          .email('Enter a valid email')
          .required('Email is required'),
      })
    case 'Address':
      return yup.object({
        addressLineOne: yup.string().required('Address One is required'),
        addressLineTwo: yup.string(),
        city: yup.string().required('City is required'),
        postalCode: yup.string().required('Postal Code is required'),
        state: yup
          .object({
            value: yup.string(),
            label: yup.string(),
          })
          .nullable()
          .required('State is required'),
        country: yup
          .object({
            code: yup.string(),
            label: yup.string(),
          })
          .nullable()
          .required('Country is required'),
      })
    default:
      break
  }
}

export default function AccordionForm({
  children,
  label,
  displayValue,
  initialValues,
  lastAccordion,
  handleAccordion,
  handleSubmit,
  expanded,
}) {
  return (
    <GenericForm
      initialValues={initialValues}
      validationSchema={getValidationSchema(label)}
      onSubmit={handleSubmit}
    >
      <Accordion
        lastAccordion={lastAccordion}
        expanded={expanded}
        onChange={handleAccordion}
        square
      >
        <AccordionSummary
          expandIcon={<ChevronRightIcon />}
          aria-controls="panel1c-content"
          id={`${label}Panel`}
        >
          <Box
            display="flex"
            flexGrow={1}
            flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
          >
            <Box minWidth={150} maxWidth={170} flex="0 0 30%">
              <Typography variant="h5">{label}</Typography>
            </Box>
            <Box flex="0 0 45%" whiteSpace="nowrap">
              {displayValue}
            </Box>
          </Box>
          {!expanded && <UpdateButton color="primary">Update</UpdateButton>}
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
        <Divider />
        <ActionButtons
          initialValues={initialValues}
          handleAccordion={handleAccordion}
        />
      </Accordion>
    </GenericForm>
  )
}

AccordionForm.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  displayValue: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  initialValues: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  lastAccordion: PropTypes.bool,
  expanded: PropTypes.bool.isRequired,
  handleAccordion: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}
