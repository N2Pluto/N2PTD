// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import UserControl from 'src/views/admin/userControl/userControl'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>
            <Link href='https://mui.com/components/tables/' target='_blank'>
              User Control
            </Link>
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title='Customized Table' titleTypographyProps={{ variant: 'h6' }} />
            <UserControl />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
