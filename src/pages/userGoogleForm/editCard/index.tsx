// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import UserGoogleFormCard from 'src/views/userGoogleForm/UserGoogleForm'
import LayoutAuth from 'src/layouts/LayoutAuth'
import UserEditProfile from 'src/views/userForm/editProfile/editProfile'
import EditProfileCard from 'src/views/userForm/editProfile/editProfileCard'
import EditProfileList from 'src/views/userForm/editProfile/editProfileList'

const MUITable = () => {
  return (
    <LayoutAuth>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <EditProfileCard />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <EditProfileList />
        </Grid>
      </Grid>
    </LayoutAuth>
  )
}

export default MUITable
