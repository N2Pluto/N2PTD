// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AdminLayout from 'src/layouts/AdminLayout'
import CreateGoogleForm from 'src/views/admin/googleForm/createGoogleForm'
import GoogleFormCard from 'src/views/admin/googleForm/googleFormCard'
import ChangeRoomControl from 'src/views/admin/form/changeRoomForm/changeRoomControl'
import EditProfileControl from 'src/views/admin/form/editProfileForm/editProfileControl'
import TransferRoomControl from 'src/views/admin/form/transferRoomForm/transferRoomControl'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <TransferRoomControl />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
