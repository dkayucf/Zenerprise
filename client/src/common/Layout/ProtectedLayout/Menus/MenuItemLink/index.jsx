/* eslint-disable react/display-name */
import React, { forwardRef, cloneElement } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { NavLink } from 'react-router-dom'
import { MenuItem, ListItemIcon, Typography } from '@mui/material/'
import { lighten } from '@mui/material/styles'

import makeStyles from '@mui/styles/makeStyles'

const NavLinkRef = forwardRef((props, ref) => (
  <NavLink innerRef={ref} {...props} />
))

const useStyles = makeStyles(
  (theme) => ({
    root: ({ sidebarIsOpen }) => ({
      color: theme.palette.text.secondary,
      paddingLeft: sidebarIsOpen ? 40 : 12,
      borderLeft: '3px solid transparent',
    }),
    active: () => ({
      color: theme.palette.text.primary,
      borderLeftColor: theme.palette.primary.light,
      backgroundColor: lighten(theme.palette.primary.light, 0.75),
    }),
    icon: { minWidth: theme.spacing(5) },
  }),
  { name: 'RaMenuItemLink' }
)

const MenuItemLink = forwardRef((props, ref) => {
  const { className, primaryText, leftIcon, ...rest } = props
  const classes = useStyles(props)

  const renderMenuItem = () => {
    return (
      <MenuItem
        className={classnames(classes.root, className)}
        activeClassName={classes.active}
        component={NavLinkRef}
        ref={ref}
        tabIndex={0}
        {...rest}
      >
        {leftIcon && (
          <ListItemIcon className={classes.icon}>
            {cloneElement(leftIcon, {
              titleAccess: primaryText,
            })}
          </ListItemIcon>
        )}
        <Typography>{primaryText}</Typography>
      </MenuItem>
    )
  }

  return renderMenuItem()
})

MenuItemLink.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  leftIcon: PropTypes.element,
  onClick: PropTypes.func,
  primaryText: PropTypes.node,
  staticContext: PropTypes.object,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
}

export default MenuItemLink
