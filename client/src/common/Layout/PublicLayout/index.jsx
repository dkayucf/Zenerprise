import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import { Box, Container } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import Footer from '../Shared/Footer'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      padding: theme.spacing(3),
    },
  })
)

const PublicLayout = ({ children }) => {
  const classes = useStyles()

  return (
    <Box>
      <Header />
      <Container maxWidth={false} component="main" className={classes.root}>
        {children}
      </Container>
      <Container maxWidth={false} component="footer">
        <Footer />
      </Container>
    </Box>
  )
}

PublicLayout.propTypes = {
  children: PropTypes.node,
}

export default PublicLayout
