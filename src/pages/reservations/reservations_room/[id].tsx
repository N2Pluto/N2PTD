// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import ReservationRoom from 'src/views/reservations/Reservation_Room'

const Reservation = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={3}>
          <ReservationRoom />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Reservation
