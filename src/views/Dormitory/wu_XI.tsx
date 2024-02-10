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

const DormitorydetailsXI = () => {
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('Dormitory_Building').select('name , images_url').eq('dorm_id', 7)
        if (error) {
          throw error
        }
        setDormitoryBuilding(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardMedia sx={{ height: '14.5625rem' }} image={dormitoryBuilding[0]?.images_url} />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          {dormitoryBuilding.map(dorm => (
            <span>{dorm.name}</span>
          ))}
        </Typography>
        <Typography variant='body2'>
          {' '}
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

export default DormitorydetailsXI
