// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LayoutAuth from 'src/layouts/LayoutAuth'
import RenewalChooseForm from 'src/views/admin/renewalDormitory/renewalChooseForm'
import Profile from 'src/views/profile/profileview'
import ReservationBotton from 'src/views/reservations/reservation/Reservation_Botton'
import ReservationsStatistics from 'src/views/reservations/reservation/Reservations_Statistics'


const profile = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
            <RenewalChooseForm />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Profile />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default profile
