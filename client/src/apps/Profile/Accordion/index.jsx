import React from 'react'
import { FieldArray } from 'formik'
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
import { countries } from '../../../common/FormComponents/CountryInput/'
import { useAuth } from '../../../contexts/auth'
import ActionButtons from './ActionButtons'
import {
  addressValidationSchema,
  emailValidationSchema,
  phoneValidationSchema,
  passwordValidationSchema,
  nameValidationSchema,
} from '../ValidationSchemas'

const Accordion = styled(MuiAccordion)`
  ${({ theme, $lastAccordion }) => `
    && {
      width: 100%;
      box-shadow: none;
      border: 1px solid ${theme.palette.divider};
      border-left: 0;
      border-right: 0;
      border-bottom: ${
        $lastAccordion ? `1px solid ${theme.palette.divider}` : 0
      };
    }
  `}
`

const AccordionDetails = styled(MuiAccordionDetails)`
  align-items: center;
`
const StyledButton = styled(Button)`
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

const getValidationSchema = (label, validateEmail) => {
  switch (label) {
    case 'Name':
      return nameValidationSchema
    case 'Password':
      return passwordValidationSchema
    case 'Phone Number':
      return phoneValidationSchema
    case 'Email':
      return emailValidationSchema(validateEmail)
    case 'Address':
      return addressValidationSchema
    default:
      break
  }
}

export default function AccordionForm({
  children,
  label,
  name,
  displayValue,
  initialValues,
  lastAccordion,
  handleAccordion,
  handleSubmit,
  expanded,
  validateOnChange,
}) {
  const { validateEmail } = useAuth()
  return (
    <GenericForm
      initialValues={initialValues}
      validationSchema={getValidationSchema(label, validateEmail)}
      schemaContext={{
        countries,
      }}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange={validateOnChange}
    >
      <FieldArray name={name}>
        {() => (
          <Accordion
            $lastAccordion={lastAccordion}
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
              {expanded ? null : (
                <StyledButton color="primary">Update</StyledButton>
              )}
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
            <Divider />
            <ActionButtons
              initialValues={initialValues}
              handleAccordion={handleAccordion}
              disableAction={validateOnChange}
            />
          </Accordion>
        )}
      </FieldArray>
    </GenericForm>
  )
}

AccordionForm.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  children: PropTypes.node.isRequired,
  displayValue: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  initialValues: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  lastAccordion: PropTypes.bool,
  expanded: PropTypes.bool.isRequired,
  handleAccordion: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validateOnChange: PropTypes.bool,
}

AccordionForm.defaultProps = {
  name: '',
  lastAccordion: false,
  validateOnChange: true,
}
