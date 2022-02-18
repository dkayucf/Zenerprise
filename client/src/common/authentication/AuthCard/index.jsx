import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { formatDistanceToNow } from 'date-fns'
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Container,
  Box,
} from '@material-ui/core'
import { join, match, replace, test } from 'ramda'
import useCountDown from 'react-countdown-hook'
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

const CountDownTimer = ({ message }) => {
  const initialTime = parseInt(join('', match(/[0-9]/g, message)))

  const [timeLeft, { start, pause, resume, reset }] = useCountDown(
    initialTime * 1000,
    1000
  )

  useEffect(() => {
    start()
  }, [])

  return replace(
    initialTime,
    formatDistanceToNow(new Date(Date.now() + timeLeft)),
    message
  )
}

export default function AuthCard({ children, logo, cardHeading }) {
  const classes = useStyles()
  const { loginStatus, loginStatusMessage, signUpStatus } = useAuth()
  const hasCountdownTimer = test(/[0-9]/g, loginStatusMessage)

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
          {loginStatus === 'error' || signUpStatus === 'error' ? (
            <Box mt={2}>
              <Alert
                icon={<WarningOutlinedIcon fontSize="inherit" />}
                variant="outlined"
                severity="error"
              >
                <Box fontSize={13}>
                  {hasCountdownTimer ? (
                    <CountDownTimer message={loginStatusMessage} />
                  ) : (
                    loginStatusMessage
                  )}
                </Box>
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
