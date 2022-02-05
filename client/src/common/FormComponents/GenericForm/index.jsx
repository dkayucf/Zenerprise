import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import { fullValidatorForSchema } from '../helpers'

export default function GenericForm({
  children,
  initialValues,
  onSubmit,
  validationSchema,
  schemaContext,
  ...rest
}) {
  const handleOnSubmit = useCallback(
    (values, actions) =>
      onSubmit(
        values,
        (resetValues) => actions.resetForm({ values: resetValues || values }),
        actions,
        initialValues
      ),
    [onSubmit, initialValues]
  )

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      validate={fullValidatorForSchema(validationSchema, {
        context: schemaContext,
      })}
      {...rest}
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
  schemaContext: PropTypes.object,
}
