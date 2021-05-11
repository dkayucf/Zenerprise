import React from 'react'
// import PropTypes from 'prop-types'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Divider,
  CardActions,
  Button,
} from '@material-ui/core/'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down('xs')]: {
        borderLeft: 0,
        borderRight: 0,
        borderRadius: 0,
      },
    },
  })
)

const user = {
  avatar: '/static/images/avatar_6.png',
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith',
  timezone: 'GTM-7',
}

export default function TabCard() {
  const classes = useStyles()

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Avatar src={user.avatar} style={{ height: 100, width: 100 }} />
          <Typography color="textPrimary" gutterBottom variant="h3">
            {user.name}
          </Typography>
          <Typography color="textSecondary" variant="body1">
            {`${user.city} ${user.country}`}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="primary" fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  )
}
