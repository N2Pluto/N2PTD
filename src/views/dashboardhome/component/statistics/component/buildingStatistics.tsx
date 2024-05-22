// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LocalHotelIcon from '@mui/icons-material/LocalHotel';

// ** Icons Imports
import Heart from 'mdi-material-ui/Heart'
import Twitter from 'mdi-material-ui/Twitter'
import ShareVariant from 'mdi-material-ui/ShareVariant'
import { useEffect, useState } from 'react'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

const CardBuildingStatistics = () => {

  const [doom, setDoom] = useState([])

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const response = await fetch('/api/statistics/building', {
          method: 'GET'
        })
        const data = await response.json()
        setDoom(data)
      } catch (error) {
        console.error('Error fetching round profile:', error)
      }
    }
    fetchUserdata()
  }, [])
  console.log('doom',doom)


  const doomM = doom.filter((b: any) => b.type_gender === 'male').length
  const doomF = doom.filter((b: any) => b.type_gender === 'female').length


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
        <Typography
          variant='h5'
          sx={{ display: 'flex', marginBottom: 2, alignItems: 'center', color: 'common.white' }}
        >
          <CorporateFareIcon sx={{ fontSize: '5.5rem' }} />
        </Typography>

        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          BUILDING
        </Typography>
        <Typography variant='body1' sx={{ marginBottom: 3, color: 'common.white' }}>
        male : {doomM}  | female : {doomF}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardBuildingStatistics