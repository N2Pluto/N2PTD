// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { CardMedia } from '@mui/material'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import supabase from 'src/libs/supabase'

const RoomCard = () => {
  const [dormitoryRoom, setDormitoryRoom] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('Dormitory_Room').select('room_number, bed_capacity').limit(6)
        if (error) {
          throw error
        }
        setDormitoryRoom(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      {/* <CardMedia sx={{ height: '14.5625rem' }} image='https://img5.pic.in.th/file/secure-sv1/wu.png' /> */}
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
         
        </Typography>
        <Typography variant='body2'>Dormitory details</Typography>
        <Link href='/'>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pt: 5 }}>
            <Button variant='contained'>Reserve</Button>
          </Box>
        </Link>
      </CardContent>
    </Card>
  )
}

export default RoomCard
