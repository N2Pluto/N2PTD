import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TopHome from './component/top'
import { Box } from '@mui/material'

import CustomImageList from './component/ImageListTop'


const HeroDashboard = () => {
  return (
    <Grid  spacing={6} >
      <Box>
        <Grid spacing={6} container sx={{ pt: 10 }}>
          <Grid item xs={12} md={12} lg={12}>

          </Grid>
          <Grid item xs={12} md={12} lg={8}>
            <TopHome />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TopHome />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  )
}

export default HeroDashboard
