import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'
import FacebookPostAndEdit from './component/postAndEdit'
import NewPost from './component/newPost'


const HeroSection = () => {
  return (
    <Grid container spacing={6} className='bg-1'>
      <Box>
      <Grid item xs={12} md={12} lg={12} sx={{pb:5}}>
        <NewPost />


        </Grid>
        <Grid item xs={12} md={12} lg={12}>
        <FacebookPostAndEdit />


        </Grid>
      </Box>
    </Grid>
  )
}

export default HeroSection
