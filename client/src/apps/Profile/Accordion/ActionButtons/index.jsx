import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useFormikContext } from 'formik'
import {
  AccordionActions as MuiAccordionAction,
  Button,
  Box,
} from '@material-ui/core'
import LoadingButton from '../../../../common/LoadingButton'

export default function AccordionActions({
  initialValues,
  handleAccordion,
  disableAction,
}) {
  const { isSubmitting, isValid, resetForm, dirty } = useFormikContext()
  const handleCancel = useCallback(() => {
    handleAccordion()
    resetForm(initialValues)
  }, [initialValues, resetForm, handleAccordion])

  return (
    <MuiAccordionAction
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Box display="flex" ml="auto">
        <Button size="small" onClick={handleCancel}>
          Cancel
        </Button>
        <LoadingButton
          isPending={isSubmitting && isValid}
          type="submit"
          size="small"
          variant="contained"
          color="primary"
          disabled={(!dirty || !isValid) && disableAction}
        >
          Save
        </LoadingButton>
      </Box>
    </MuiAccordionAction>
  )
}

AccordionActions.propTypes = {
  children: PropTypes.node,
  initialValues: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  handleAccordion: PropTypes.func,
  disableAction: PropTypes.bool,
}
