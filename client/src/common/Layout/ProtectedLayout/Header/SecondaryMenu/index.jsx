import React, { useCallback } from 'react'
import {
  Avatar,
  MenuItem,
  Menu,
  ListItemText,
  ListItemIcon,
  Box,
  Divider,
} from '@material-ui/core'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { useHeader } from '../../../../../contexts/header'
import { useAuth } from '../../../../../contexts/auth'
import { useRouter } from '../../../../../hooks/useRouter'
import { compose, propOr, find, propEq, prop } from 'ramda'

const StyledMenu = withStyles(({ spacing }) => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  paper: {
    border: '1px solid #d3d4d5',
    borderRadius: 4,
    width: '100%',
    maxWidth: '275px',
    marginTop: spacing(0.5),
    boxShadow: '0 2px 4px rgb(0 0 0 / 8%), 0 4px 12px rgb(0 0 0 / 8%)',
  },
}))((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MenuItem)

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: '4rem',
    height: '4rem',
    fontSize: '24px',
    fontWeight: 700,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  },
}))

const SecondaryMenu = () => {
  const { push } = useRouter()
  const { anchorEl, menuId, isMenuOpen, handleMenuClose } = useHeader()
  const classes = useStyles()
  const { logout, profile } = useAuth()
  const handleProfile = useCallback(() => push('/auth/profile'), [push])

  const primaryEmail = compose(
    prop('email'),
    find(propEq('primaryEmail', true)),
    propOr([], 'email')
  )(profile)

  return (
    <StyledMenu
      disableAutoFocusItem
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      MenuListProps={{ onMouseLeave: handleMenuClose }}
    >
      <StyledMenuItem onClick={handleProfile}>
        <ListItemIcon>
          <Avatar className={classes.avatar}>{profile?.name?.initials}</Avatar>
        </ListItemIcon>
        <Box ml={1}>
          <ListItemText
            primary={profile?.name?.fullName || 'Hello'}
            primaryTypographyProps={{ style: { fontWeight: 700 } }}
          />
          <ListItemText primary={primaryEmail || '-'} />
        </Box>
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem>My account</StyledMenuItem>
      <StyledMenuItem onClick={logout}>Logout</StyledMenuItem>
    </StyledMenu>
  )
}

export default SecondaryMenu
