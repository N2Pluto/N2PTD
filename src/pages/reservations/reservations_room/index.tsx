// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import ReservationRoomTest from './[id]'

const ReservationRoom = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={8}>
          <ReservationRoomTest />
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <ReservationRoomTest />
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <ReservationRoomTest />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default ReservationRoom
