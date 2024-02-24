// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LayoutAuth from 'src/layouts/LayoutAuth'
import ReservationBuilding from 'src/views/reservations/Reservation_Building'
import ReservationFilter from 'src/views/reservations/ReservationFilter'

const Reservation = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12} pb={3}>
            {/* <ReservationFilter /> */}
          </Grid>
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
            <ReservationBuilding />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Reservation
