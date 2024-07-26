// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import UserGoogleFormCard from 'src/views/userGoogleForm/UserGoogleForm'
import LayoutAuth from 'src/layouts/LayoutAuth'
import UserChangeRoom from 'src/views/userForm/changeRoom/changeRoom'
import ChangeRoomCard from 'src/views/userForm/changeRoom/changeRoomCard'
import ChangeRoomList from 'src/views/userForm/changeRoom/changeRoomList'
import { CardHeader } from '@mui/material'

const MUITable = () => {
  return (
    <LayoutAuth>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <ChangeRoomCard />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='Request List' />
            <ChangeRoomList />
          </Card>
        </Grid>
      </Grid>
    </LayoutAuth>
  )
}

export default MUITable
