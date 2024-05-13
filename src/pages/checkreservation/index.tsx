// ** MUI Imports
import { Box, Button, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import router from 'next/router'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LayoutAuth from 'src/layouts/LayoutAuth'

const handleCheckEligibility = () => {
  router.push('/dashboard')
}

const Reservation = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12}>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h4'>คุณไม่มีสิทธิ์ จองในรอบนี้</Typography>
            </Box>
            <Button variant='contained' color='primary' onClick={() => handleCheckEligibility()}>
              {' '}
              ตรวจสอบคุณสมบัติ
            </Button>
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Reservation
