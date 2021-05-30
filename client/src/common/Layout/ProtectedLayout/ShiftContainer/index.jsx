import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { Container } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { useHeader } from '../../../../contexts/header'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: ({ component, drawerVariant }) => ({
      minHeight: component === 'main' ? '88vh' : null,
      padding: theme.spacing(3),
      marginTop: component === 'main' ? theme.spacing(8) : null,
      marginLeft: drawerVariant === 'permanent' ? theme.spacing(8) : 0,
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(3, 0),
      },
    }),
    content: ({ drawerVariant }) => ({
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width:
        drawerVariant === 'permanent'
          ? `calc(100% - ${theme.spacing(8)}px)`
          : '100%',
    }),
    contentShift: ({ drawerWidth }) => ({
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    }),
  })
)

const ShiftContainer = ({ children, component }) => {
  const { drawerWidth, shiftContent, drawerVariant } = useHeader()
  const classes = useStyles({ drawerWidth, component, drawerVariant })

  return (
    <Container
      maxWidth={false}
      component={component}
      className={clsx(classes.root, {
        [classes.content]: !shiftContent,
        [classes.contentShift]: shiftContent,
      })}
    >
      {children}
    </Container>
  )
}

ShiftContainer.propTypes = {
  children: PropTypes.node,
  component: PropTypes.string,
}

export default ShiftContainer
