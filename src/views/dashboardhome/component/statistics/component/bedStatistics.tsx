// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import { useEffect, useState } from 'react'
import LocalHotelIcon from '@mui/icons-material/LocalHotel';

const CardBedStatistics = () => {
  const [bed, setBed] = useState([])

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const response = await fetch('/api/statistics/bed', {
          method: 'GET'
        })
        const data = await response.json()
        setBed(data)
      } catch (error) {
        console.error('Error fetching round profile:', error)
      }
    }
    fetchUserdata()
  }, [])

  const bedFree = bed.filter((b: any) => b.bed_status == true).length
  const bedOccupied = bed.filter((b: any) => b.bed_status == false).length

  return (
    <Card
      sx={{
        border: 0,
        boxShadow: 0,
        color: 'common.white',
        backgroundColor: 'pink',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CardContent
        sx={{
          padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant='h5' sx={{ display: 'flex', marginBottom: 2, alignItems: 'center', color: 'common.white' }}>
          <LocalHotelIcon sx={{ fontSize: '5.5rem' }} />
        </Typography>

        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          BED
        </Typography>
        <Typography variant='body1' sx={{ marginBottom: 3, color: 'common.white' }}>
          vacant : {bedFree}  | unavailable : {bedOccupied}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardBedStatistics
