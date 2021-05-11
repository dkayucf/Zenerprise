import * as React from 'react'
import PropTypes from 'prop-types'
import ExpandMore from '@material-ui/icons/ExpandMore'
import List from '@material-ui/core/List'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  icon: { minWidth: theme.spacing(5) },
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
      <MenuItem dense={dense} button onClick={handleToggle}>
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
