import React from 'react'
import BioCard from './BioCard'
import TabCard from './TabCard'
import { Grid } from '@material-ui/core'

export default function Profile() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={9} lg={8} xl={6}>
        <TabCard />
      </Grid>
      <Grid item xs={12} sm={12} md={3} lg={3} xl={2}>
        <BioCard />
      </Grid>
    </Grid>
  )
}
