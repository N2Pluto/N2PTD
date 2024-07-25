// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useState } from 'react'
import { CardMedia } from '@mui/material'

const Round = () => {
  const [round, setRound] = useState([])

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const response = await fetch('/api/round/', {
          method: 'GET'
        })
        const data = await response.json()
        setRound(data)
      } catch (error) {
        console.error('Error fetching round profile:', error)
      }
    }
    fetchUserdata()
  }, [])

  return (
    <Card
      sx={{
        mt: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRadius: 1
      }}
    >
      <CardMedia
        component='img'
        sx={{ width: '100%', height: 'auto' }}
        image='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/file-BMWpAM5t8aMMUepyJoO8Orb8.jpg'
        alt='Dormitory Booking Period'
      />
      <CardHeader title='Dormitory Booking Period' />
      <CardContent>
        {round.length > 0 ? (
          round.map((roundItem, index) => (
            <Typography key={index} variant='body2' component='div' sx={{ marginBottom: 2 }}>
              <Typography variant='body2'>
                <strong>Booking Period:</strong> {roundItem.round_name}
              </Typography>
              <Typography variant='body2'>
                <strong>Start Date:</strong> {new Date(roundItem.start_date).toLocaleDateString()}
              </Typography>
              <Typography variant='body2'>
                <strong>End Date:</strong> {new Date(roundItem.end_date).toLocaleDateString()}
              </Typography>
              <Typography variant='body2'>
                <strong>Eligible Student IDs:</strong>{' '}
                {roundItem.student_year
                  .split(',')
                  .map(Number)
                  .sort((a: number, b: number) => a - b)
                  .join(', ')}
              </Typography>
            </Typography>
          ))
        ) : (
          <Typography variant='body2'>No booking periods are currently open.</Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default Round
