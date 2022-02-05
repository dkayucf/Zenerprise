import React from 'react'
import * as yup from 'yup'
import { Button, Grid } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'
import AuthCard from '../AuthCard'
import Password from '../../FormComponents/Password'
import GenericForm from '../../FormComponents/GenericForm'

import { useAuth } from '../../../contexts/auth'
// import { useRouter } from '../../../hooks/useRouter'

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
    .matches(/^((?=.*?[0-9])|(?=.*?[a-zA-Z]))/, 'At least 1 letter or number.')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
})

const initialValues = {
  password: '',
  confirmPassword: '',
}

export default function ResetPasswordEmail() {
  // const { push } = useRouter()
  const classes = useStyles()
  const { sendPasswordResetEmail } = useAuth()
  // const redirect = useCallback(
  //   (email) => push(`/forgot-password?email=${email}`),
  //   [push]
  // )

  return (
    <AuthCard logo={<LockOutlinedIcon />} cardHeading="Reset Password">
      <GenericForm
        initialValues={initialValues}
        onSubmit={sendPasswordResetEmail}
        validationSchema={validationSchema}
      >
        <Grid container>
          <Grid item xs={12}>
            <Password
              autoComplete="new-password"
              name="password"
              label="Password"
            />
          </Grid>
          <Grid item xs={12}>
            <Password
              autoComplete="new-password"
              name="confirmPassword"
              label="Confirm Password"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </GenericForm>
    </AuthCard>
  )
}
