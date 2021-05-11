import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ButtonRouter } from '../../../RouterLink'
import { AppBar, Toolbar, Box } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const Header = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Box mr="auto">
            <ButtonRouter to="/" color="inherit">
              Home
            </ButtonRouter>
          </Box>
          <ButtonRouter to="/register" color="inherit">
            Register
          </ButtonRouter>
          <ButtonRouter to="/login" color="inherit">
            Login
          </ButtonRouter>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
