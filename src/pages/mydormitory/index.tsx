// ** MUI Imports
import { CardHeader } from '@mui/material'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LayoutAuth from 'src/layouts/LayoutAuth'
import RenewalChooseForm from 'src/views/admin/renewalDormitory/renewalChooseForm'
import ReservationApprove from 'src/views/admin/reservationApprove/reservation-view'
import CardUserStatistics from 'src/views/dashboardhome/component/statistics/component/userStatistics'
import CardUserProfile from 'src/views/mydormmitory/profile'
import Profile from 'src/views/profile/profileview'
import ReservationBotton from 'src/views/reservations/reservation/Reservation_Botton'
import ReservationsStatistics from 'src/views/reservations/reservation/Reservations_Statistics'
import Mydormitorydetail from 'src/views/mydormmitory/myDormitory'
import MyRoommate from 'src/views/mydormmitory/myRoommate'

const myDormitory = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12} md={12}>
            <CardUserProfile />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='Dormitory information' titleTypographyProps={{ variant: 'h6' }} />
            <Mydormitorydetail />
          </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='Room  information' titleTypographyProps={{ variant: 'h6' }} />
            <MyRoommate />
          </Card>
        </Grid>


        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default myDormitory
