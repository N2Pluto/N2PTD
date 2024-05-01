// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LayoutAuth from 'src/layouts/LayoutAuth'
import ReservationBotton from 'src/views/reservations/reservation/Reservation_Botton'
import ReservationsStatistics from 'src/views/reservations/reservation/Reservations_Statistics'



const Reservation = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
          <ReservationBotton/>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
          <ReservationsStatistics/>

          </Grid>
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Reservation
