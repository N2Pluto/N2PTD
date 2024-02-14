// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import ReservationBed from 'src/views/reservations/Reservation_Bed'

const Reservation = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} lg={10}>
          <ReservationBed />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Reservation
