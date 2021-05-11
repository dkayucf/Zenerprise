import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useFormikContext } from 'formik'
import {
  AccordionActions as MuiAccordionAction,
  Button,
} from '@material-ui/core'
import LoadingButton from '../../../../common/LoadingButton'

export default function AccordionActions({ initialValues, handleAccordion }) {
  const { isSubmitting, isValid, resetForm, dirty } = useFormikContext()
  const handleCancel = useCallback(() => {
    handleAccordion()
    resetForm(initialValues)
  }, [initialValues, resetForm, handleAccordion])
  return (
    <MuiAccordionAction>
      <Button size="small" onClick={handleCancel}>
        Cancel
      </Button>
      <LoadingButton
        isPending={isSubmitting && isValid}
        type="submit"
        size="small"
        variant="contained"
        color="primary"
        disabled={!dirty || !isValid}
      >
        Save
      </LoadingButton>
    </MuiAccordionAction>
  )
}

AccordionActions.propTypes = {
  initialValues: PropTypes.object,
  handleAccordion: PropTypes.func,
}
