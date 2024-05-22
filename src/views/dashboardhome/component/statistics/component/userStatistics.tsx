// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import Heart from 'mdi-material-ui/Heart'
import Twitter from 'mdi-material-ui/Twitter'
import ShareVariant from 'mdi-material-ui/ShareVariant'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useEffect, useState } from 'react'

const CardUserStatistics = () => {
  const [user, setUser] = useState([])

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const response = await fetch('/api/statistics/user', {
          method: 'GET'
        })
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Error fetching round profile:', error)
      }
    }
    fetchUserdata()
  }, [])

  const userCount = user.filter((u: any) => u.role === 'user').length

  console.log('Count of users:', userCount)

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
          <AccountCircleIcon sx={{ fontSize: '5.5rem' }} />
        </Typography>

        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          User
        </Typography>
        <Typography variant='body1' sx={{ marginBottom: 3, color: 'common.white' }}>
        all users : {userCount}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardUserStatistics