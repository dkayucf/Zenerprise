import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, yupToFormErrors, validateYupSchema } from 'formik'

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
      validate={(values) => {
        try {
          //The 4th parameter passed to validateYupSchema is a context that can be accessed within yup.when($propertyName) https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema
          validateYupSchema(values, validationSchema, true, schemaContext)
        } catch (err) {
          return yupToFormErrors(err)
        }
        return {}
      }}
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

GenericForm.defaultProps = {
  schemaContext: {},
}
