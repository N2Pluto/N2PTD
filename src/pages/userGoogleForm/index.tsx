// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import AdminLayout from 'src/layouts/AdminLayout'
import UserGoogleFormCard from 'src/views/userGoogleForm/UserGoogleForm'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{ pl: 4 }}>
            Google Form{' '}
          </Typography>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>

            <UserGoogleFormCard/>

        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
