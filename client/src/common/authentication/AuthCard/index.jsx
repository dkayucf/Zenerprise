import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Container,
  Box,
} from '@material-ui/core'
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined'
import Alert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '../../../contexts/auth'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}))

export default function AuthCard({ children, logo, cardHeading }) {
  const classes = useStyles()
  const { loginStatus, signUpStatus } = useAuth()
  const { hasError: loginError } = loginStatus
  const { hasError: signupError } = signUpStatus

  return (
    <Container className={classes.container} maxWidth="xs">
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar className={classes.avatar}>{logo}</Avatar>
            <Typography component="h1" variant="h5">
              {cardHeading}
            </Typography>
          </Box>
          {loginError || signupError ? (
            <Box mt={2}>
              <Alert
                icon={<WarningOutlinedIcon fontSize="inherit" />}
                variant="outlined"
                severity="error"
              >
                <Box
                  fontSize={13}
                >{`Some of your info isn't correct. Please try again.`}</Box>
              </Alert>
            </Box>
          ) : null}
          {children}
        </CardContent>
      </Card>
    </Container>
  )
}

AuthCard.propTypes = {
  logo: PropTypes.element,
  children: PropTypes.node,
  cardHeading: PropTypes.string,
}
