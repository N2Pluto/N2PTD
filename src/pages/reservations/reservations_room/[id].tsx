// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LayoutAuth from 'src/layouts/LayoutAuth'
import ReservationRoom from 'src/views/reservations/Reservation_Room'

const Reservation = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12}>
            <ReservationRoom />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Reservation
