import React, { useContext, createContext, useState } from "react"
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useMediaQuery } from '@material-ui/core'

const headerContext = createContext({
    shiftContent: false,
    drawerWidth: 240,
    drawerVariant: 'persistent',
    drawerOpen: false,
    drawerFocusOpen: false,
    anchorEl: null,
    mobileMoreAnchorEl: null,
    isMenuOpen: false,
    isMobileMenuOpen: false,
    menuId: 'primary-search-account-menu',
    mobileMenuId: 'primary-search-account-menu-mobile',
    handleProfileMenuOpen: () => {},
    handleMobileMenuOpen: () => {},
    handleMobileMenuClose: () => {},
    handleMenuClose: () => {},
    handleDrawerToggle: () => {},
    setDrawerOpen: () => {},
    setDrawerFocusOpen: () => {}
})

const ProvideHeader = ({ children }) => {
  const theme = useTheme()
  const isDesktopMedia = useMediaQuery(theme.breakpoints.up('md'))
  const drawerWidth = 240
  const drawerVariant = isDesktopMedia ? 'permanent' : 'persistent'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerFocusOpen, setDrawerFocusOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const menuId = 'primary-search-account-menu'
  const mobileMenuId = 'primary-search-account-menu-mobile'
  const shiftContent = (drawerOpen || drawerFocusOpen) && isDesktopMedia

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen)

  return (
    <headerContext.Provider value={{
        shiftContent,
        drawerWidth,
        drawerVariant,
        anchorEl,
        mobileMoreAnchorEl,
        isMenuOpen,
        isMobileMenuOpen,
        drawerOpen,
        drawerFocusOpen,
        menuId,
        mobileMenuId,
        handleProfileMenuOpen,
        handleMobileMenuOpen,
        handleMobileMenuClose,
        handleMenuClose,
        handleDrawerToggle,
        setDrawerOpen,
        setDrawerFocusOpen
    }}>
      {children}
    </headerContext.Provider>
  )
}

ProvideHeader.propTypes = {
    children: PropTypes.node
}

export const useHeader = () => useContext(headerContext)
export default ProvideHeader
  