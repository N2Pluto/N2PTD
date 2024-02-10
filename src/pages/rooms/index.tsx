// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import RoomCard from 'src/views/rooms/Room'

const RoomReservation = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={2}>
          <RoomCard />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <RoomCard />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <RoomCard />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <RoomCard />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <RoomCard />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <RoomCard />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default RoomReservation
