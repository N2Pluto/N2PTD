// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LayoutAuth from 'src/layouts/LayoutAuth'
import ReservationInfo from 'src/views/reservations/reservation/Reservation_Info'

const Reservation = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
            <ReservationInfo />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Reservation
