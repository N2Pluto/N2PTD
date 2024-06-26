// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LayoutAuth from 'src/layouts/LayoutAuth'
import ReservationHomePage from 'src/views/reservations/reservation/Reservation_HomePage'

const Reservation = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
            <ReservationHomePage />
          </Grid>
         
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Reservation
