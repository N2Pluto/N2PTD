// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
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
    <Card>
      <CardMedia sx={{ height: '14.5625rem' }} image='/images/cards/glass-house.png' />
      <CardHeader title=' Round of open applications' />
      <CardContent>
        {round.length > 0 ? (
          round.map((roundItem, index) => (
            <Typography key={index} variant='body2'>
              รอบที่เปิด {roundItem.round_name} เริ่ม {new Date(roundItem.start_date).toLocaleDateString()} สิ้นสุด{' '}
              {new Date(roundItem.end_date).toLocaleDateString()} รับนักศึกษา รหัสนักศึกษา{' '}
              {roundItem.student_year
                .split(',')
                .map(Number)
                .sort((a : number, b : number) => a - b)
                .join(' , ')}
            </Typography>
          ))
        ) : (
          <Typography variant='body2'>ไม่มีรอบที่เปิด</Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default Round
