// ** MUI Imports
import Grid from '@mui/material/Grid'
import React, { useEffect } from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LayoutAuth from 'src/layouts/LayoutAuth'
import DormitorydetailsA1 from 'src/views/Dormitory/wu_A1'
import DormitorydetailsA2 from 'src/views/Dormitory/wu_A2'
import DormitorydetailsB1 from 'src/views/Dormitory/wu_B1'
import DormitorydetailsB2 from 'src/views/Dormitory/wu_B2'
import DormitorydetailsI from 'src/views/Dormitory/wu_I'
import DormitorydetailsII from 'src/views/Dormitory/wu_II'
import DormitorydetailsIII from 'src/views/Dormitory/wu_III'
import DormitorydetailsIV from 'src/views/Dormitory/wu_IV'
import DormitorydetailsV from 'src/views/Dormitory/wu_V'
import DormitorydetailsVII from 'src/views/Dormitory/wu_VII'
import DormitorydetailsX from 'src/views/Dormitory/wu_X'
import DormitorydetailsXI from 'src/views/Dormitory/wu_XI'
import DormitorydetailsXIII from 'src/views/Dormitory/wu_XIII'
import DormitorydetailsXIV from 'src/views/Dormitory/wu_XIV'
import DormitorydetailsXVI from 'src/views/Dormitory/wu_XVI'
import DormitorydetailsXVII from 'src/views/Dormitory/wu_XVII'
import DormitorydetailsXVIII from 'src/views/Dormitory/wu_XVIII'

const Dormitory = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsI />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsII />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsIII />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsIV />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsV />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsVII />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsX />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsXI />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsXIII />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsXIV />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsXVI />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsXVII />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsXVIII />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsA1 />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsA2 />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsB1 />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DormitorydetailsB2 />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Dormitory
