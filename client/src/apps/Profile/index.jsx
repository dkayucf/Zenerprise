import React from 'react'
import TabCard from './TabCard'
import { Grid } from '@mui/material'

export default function Profile() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TabCard />
      </Grid>
    </Grid>
  )
}
