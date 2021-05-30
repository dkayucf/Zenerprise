import React, { useCallback } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Button, Grid } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'
import AuthCard from '../AuthCard'
import Input from '../../FormComponents/FormikInput'
import { LinkRouter } from '../../RouterLink'

import { useAuth } from '../../../contexts/auth'
import { useRouter } from '../../../hooks/useRouter'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
})

export default function SignUp() {
  const { push } = useRouter()
  const classes = useStyles()
  const { sendPasswordResetEmail } = useAuth()
  const redirect = useCallback(
    (email) => push(`/forgot-password?email=${email}`),
    [push]
  )

  return (
    <AuthCard logo={<LockOutlinedIcon />} cardHeading="Forgot Password">
      <Formik
        initialValues={{
          email: '',
        }}
        onSubmit={useCallback(
          (values) => sendPasswordResetEmail(values, redirect),
          [sendPasswordResetEmail, redirect]
        )}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => {
          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container>
                <Grid item xs={12}>
                  <Input name="email" label="Email" required />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Next
                  </Button>
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <LinkRouter to="/forgot-email" variant="body2">
                    Forgot your email?
                  </LinkRouter>
                </Grid>
              </Grid>
            </form>
          )
        }}
      </Formik>
    </AuthCard>
  )
}
