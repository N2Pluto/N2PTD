// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import UserGoogleFormCard from 'src/views/userGoogleForm/UserGoogleForm'
import LayoutAuth from 'src/layouts/LayoutAuth'
import UserTransferRoom from 'src/views/userForm/transferRoom/transferRoom'
import TransferRoomCard from 'src/views/userForm/transferRoom/transferRoomCard'
import TransferRoomList from 'src/views/userForm/transferRoom/transferRoomList'
import { CardHeader } from '@mui/material'

const MUITable = () => {
  return (
    <LayoutAuth>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <TransferRoomCard />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='Request List' />
            <TransferRoomList />
          </Card>
        </Grid>
      </Grid>
    </LayoutAuth>
  )
}

export default MUITable
