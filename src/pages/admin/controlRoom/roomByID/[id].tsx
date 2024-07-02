// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import { useEffect, useState } from 'react'
import router from 'next/router'
import RoomControl from 'src/views/admin/buildingControl/roomControl'

const MUITable = () => {
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])

  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData()])
    }
  }, [])

  const fetchData = async () => {
    const { data } = await fetch(`/api/building/${router.query.id}`).then(res => res.json())
    setDormitoryBuilding(data)
  }

  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{ pl: 4 }}>
            Building Control{' '}
          </Typography>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title={dormitoryBuilding?.name} titleTypographyProps={{ variant: 'h6' }} />
            <RoomControl />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
