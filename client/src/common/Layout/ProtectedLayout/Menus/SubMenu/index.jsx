import * as React from 'react'
import PropTypes from 'prop-types'
import ExpandMore from '@mui/icons-material/ExpandMore'
import List from '@mui/material/List'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
  MuiMenuItemRoot: {
    width: '100%',
    height: '100%',
    paddingTop: '14px',
    paddingBottom: '14px',
  },
  icon: { minWidth: theme.spacing(5) + '!important' },
  sidebarIsOpen: {
    '& a': {
      transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },
  },
  sidebarIsClosed: {
    '& a': {
      transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },
  },
}))

const SubMenu = ({
  handleToggle,
  sidebarIsOpen,
  isOpen,
  name,
  icon,
  children,
  dense,
}) => {
  const classes = useStyles()

  return (
    <>
      <MenuItem
        dense={dense}
        className={classes.MuiMenuItemRoot}
        component="button"
        onClick={handleToggle}
      >
        <ListItemIcon className={classes.icon}>
          {isOpen ? <ExpandMore /> : icon}
        </ListItemIcon>
        <Typography variant="body1">{name}</Typography>
      </MenuItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List
          dense={dense}
          component="div"
          disablePadding
          className={
            sidebarIsOpen ? classes.sidebarIsOpen : classes.sidebarIsClosed
          }
        >
          {children}
        </List>
      </Collapse>
    </>
  )
}

SubMenu.propTypes = {
  handleToggle: PropTypes.func,
  sidebarIsOpen: PropTypes.bool,
  isOpen: PropTypes.bool,
  name: PropTypes.string,
  icon: PropTypes.element,
  children: PropTypes.node,
  dense: PropTypes.bool,
}

export default SubMenu
