import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TopHome from './component/top'
import { Box } from '@mui/material'

import CustomImageList from './component/ImageListTop'

const HeroDashboard = () => {
  return (
    <Grid container spacing={6} className='bg-1'>
      <Box sx={{ p: 5 }}>
        <Grid  sx={{pb:5}} item xs={12} md={12} lg={12}>

        <CustomImageList />


        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TopHome />
        </Grid>
      </Box>
    </Grid>
  )
}

export default HeroDashboard
