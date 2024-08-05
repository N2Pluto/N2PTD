// ** MUI Imports
import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LayoutAuth from 'src/layouts/LayoutAuth'
import ReservationBotton from 'src/views/reservations/reservation/Reservation_Botton'
import ReservationsTicket from 'src/views/reservations/reservation/Reservation_Ticket'
import ReservationsStatistics from 'src/views/reservations/reservation/Reservations_Statistics'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { userStore } from 'src/stores/userStore'
import { useEffect, useState } from 'react'

const Reservation = () => {
  const { user } = userStore()
  const [reservation, setReservation] = useState(null)

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await fetch(`/api/reservation/select?user_id=${user?.user_id}`)
        const { reservationData, userInfoData } = await response.json()
        setReservation(reservationData[0])
      } catch (error) {
        console.error('Error fetching reservation data:', error)
      }
    }

    fetchReservationData()
  }, [user])

  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
            <ReservationsTicket />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

Reservation.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Reservation
