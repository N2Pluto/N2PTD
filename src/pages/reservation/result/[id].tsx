// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import LayoutAuth from 'src/layouts/LayoutAuth'
import ReservationResultCard from 'src/views/reservations/Reservation_Result'
import Allresult from 'src/views/reservations/result/result'


const ReservationResult = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
          <Allresult />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default ReservationResult
