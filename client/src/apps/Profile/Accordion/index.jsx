import React from 'react'
import PropTypes from 'prop-types'
import * as yup from 'yup'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Box,
  Button,
} from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import GenericForm from '../../../common/FormComponents/GenericForm'
import ActionButtons from './ActionButtons'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    width: '100%',
    boxShadow: 'none',
    border: `1px solid ${palette.divider}`,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: ({ lastAccordion }) =>
      lastAccordion ? `1px solid ${palette.divider}` : 0,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  updateBtn: {
    marginLeft: 'auto',
  },
}))

const StyledAccordionSummary = withStyles({
  expanded: {},
  content: {
    alignItems: 'center',
  },
  expandIcon: {
    '&$expanded': {
      transform: 'rotate(90deg)',
    },
  },
})(AccordionSummary)

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
  const classes = useStyles({ lastAccordion })

  return (
    <GenericForm
      initialValues={initialValues}
      validationSchema={getValidationSchema(label)}
      onSubmit={handleSubmit}
    >
      <Accordion
        className={classes.root}
        expanded={expanded}
        onChange={handleAccordion}
        square
      >
        <StyledAccordionSummary
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
          {!expanded && (
            <Button className={classes.updateBtn} color="primary">
              Update
            </Button>
          )}
        </StyledAccordionSummary>
        <AccordionDetails className={classes.details}>
          {children}
        </AccordionDetails>
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
