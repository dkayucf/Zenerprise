import * as React from 'react'
import { useState, useCallback } from 'react'
import { indexBy, prop, map } from 'ramda'
import { Box, Divider } from '@material-ui/core'

import SubMenu from './SubMenu'
import MenuItemLink from './MenuItemLink'
import Icon from '../../../Icon/index'
import { useHeader } from '../../../../contexts/header'
import { useAuth } from '../../../../contexts/auth'

const Menu = () => {
  const { drawerOpen, drawerFocusOpen } = useHeader()
  const { user } = useAuth()
  const routes = user.routes
  const menuToggleState = map((x) => !x, indexBy(prop('id'), routes))

  const [state, setState] = useState(menuToggleState)

  const open = drawerFocusOpen || drawerOpen

  const handleToggle = useCallback(
    (menu) => () => {
      setState((state) => ({ ...state, [menu]: !state[menu] }))
    },
    []
  )

  return (
    <Box mt={1}>
      {routes.length > 0 &&
        routes.map((menu, i) => (
          <Box key={i}>
            <SubMenu
              handleToggle={handleToggle(menu.id)}
              isOpen={state[menu.id]}
              sidebarIsOpen={open}
              name={menu.name}
              icon={<Icon icon={menu.icon} />}
            >
              {menu.routes && menu.routes.length > 0
                ? menu.routes.map((subMenu, index) => (
                    <MenuItemLink
                      key={index}
                      to={'/auth' + subMenu.path}
                      primaryText={subMenu.name}
                      leftIcon={<Icon icon={subMenu.icon} />}
                    />
                  ))
                : null}
            </SubMenu>
            <Divider />
          </Box>
        ))}
    </Box>
  )
}

export default Menu
