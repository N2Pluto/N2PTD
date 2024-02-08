// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import ReservationInfo from 'src/views/reservations/Reservation'
import ReservationFilter from 'src/views/reservations/ReservationFilter'

const Reservation = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={8}>
          <ReservationInfo />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ReservationFilter/>
        </Grid>
      
      </Grid>
    </ApexChartWrapper>
  )
}

export default Reservation
