import React, { useState } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles'
import {
  Card,
  CardContent,
  Box,
  Tabs,
  Tab,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material/'
import ProfileInfoProvider from '../../../contexts/profile'
import BasicInfo from '../BasicInfo'
import ContactInfo from '../ContactInfo'

const useStyles = makeStyles({
  root: {
    minHeight: '50vh',
    height: '100%',
    width: '100%',
    borderLeft: ({ isXSmall }) => isXSmall && 0,
    borderRight: ({ isXSmall }) => isXSmall && 0,
    overflow: 'unset',
  },
  cardContent: {
    display: 'flex',
    flexDirection: ({ isSmall }) => (isSmall ? 'column' : 'row'),
    height: ({ isSmall }) => (isSmall ? 'unset' : '100%'),
    paddingRight: 0,
    paddingLeft: 0,
  },
  tabs: {
    flexShrink: 0,
  },
})

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Box
      flexGrow={1}
      py={{ xs: 2, sm: 2, md: 0 }}
      px={0}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

export default function TabCard() {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles({ isSmall, isXSmall })
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Card
      className={classes.root}
      variant="outlined"
      square={isXSmall ? true : false}
    >
      <CardContent className={classes.cardContent}>
        <Tabs
          orientation={isSmall ? 'horizontal' : 'vertical'}
          centered={isSmall ? true : false}
          textColor="primary"
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="Personal Info" {...a11yProps(0)} />
          <Tab label="Business Info" {...a11yProps(1)} />
          <Tab label="Security" {...a11yProps(2)} />
        </Tabs>
        {!isSmall && <Divider orientation="vertical" />}
        <TabPanel value={value} index={0}>
          <ProfileInfoProvider>
            <BasicInfo />
            <ContactInfo />
          </ProfileInfoProvider>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </CardContent>
    </Card>
  )
}
