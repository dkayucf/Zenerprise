import React, { useCallback } from 'react'
import clsx from 'clsx'
import { Drawer, Toolbar, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { useHeader } from '../../../../contexts/header'
import Menus from '../Menus'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerContainer: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  drawerOpen: ({ drawerWidth }) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

const MenuDrawer = () => {
  const {
    drawerOpen,
    drawerFocusOpen,
    drawerWidth,
    drawerVariant,
    setDrawerFocusOpen,
  } = useHeader()
  const classes = useStyles({ drawerWidth })

  return (
    <Drawer
      onMouseEnter={useCallback(
        () => setDrawerFocusOpen(true),
        [setDrawerFocusOpen]
      )}
      onMouseLeave={useCallback(
        () => setDrawerFocusOpen(false),
        [setDrawerFocusOpen]
      )}
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: drawerOpen || drawerFocusOpen,
        [classes.drawerClose]: !drawerOpen || !drawerFocusOpen,
      })}
      open={drawerOpen || drawerFocusOpen}
      variant={drawerVariant}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: drawerOpen || drawerFocusOpen,
          [classes.drawerClose]: !drawerOpen || !drawerFocusOpen,
        }),
      }}
    >
      <Toolbar />
      <Box component="nav" className={classes.drawerContainer}>
        <Menus />
      </Box>
    </Drawer>
  )
}

export default MenuDrawer
