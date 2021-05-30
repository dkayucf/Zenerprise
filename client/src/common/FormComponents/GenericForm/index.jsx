import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import { fullValidatorForSchema } from '../helpers'

export default function GenericForm({
  children,
  initialValues,
  onSubmit,
  validationSchema,
}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) =>
        onSubmit(values, (resetValues) =>
          actions.resetForm({ values: resetValues || values })
        )
      }
      validate={fullValidatorForSchema(validationSchema)}
    >
      <Form>{children}</Form>
    </Formik>
  )
}

GenericForm.propTypes = {
  children: PropTypes.node.isRequired,
  initialValues: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  onSubmit: PropTypes.func.isRequired,
  validationSchema: PropTypes.object.isRequired,
}
