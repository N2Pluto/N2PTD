// ** MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import supabase from 'src/libs/supabase'
import { userStore } from 'src/stores/userStore'

const DormitorydetailsI = () => {
  const { user } = userStore()
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // const { data, error } = await supabase.from('Dormitory_Building').select('name , images_url').eq('dorm_id', 1)
      const { data } = await fetch('/api/building/1').then(res => res.json())

      // if (error) {
      //   throw error
      // }
      console.log('data:', data)
      setDormitoryBuilding(data)
    } catch (error) {
      console.error('Error fetching dormitory building data:', error)
    }
  }

  return (
    <Card>
      <CardMedia sx={{ height: '14.5625rem' }} image={dormitoryBuilding.images_url} />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          <span>{dormitoryBuilding.name}</span>
        </Typography>
        <Typography variant='body2'>
          <>
            - Dormitory fee: 10,000 baht per person per semester. <br /> - Monthly electricity bill payment.
          </>
        </Typography>
        <Link href='/'>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pt: 5 }}>
            <Button variant='contained'>See more detail</Button>
          </Box>
        </Link>
      </CardContent>
    </Card>
  )
}

export default DormitorydetailsI
