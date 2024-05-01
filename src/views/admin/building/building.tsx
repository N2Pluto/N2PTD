import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import router from 'next/router'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { CardActions, Dialog, DialogContent, DialogTitle, CardActionArea } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import DeleteBuilding from './deleteBuilding'

import { userStore } from 'src/stores/userStore'

const handleClick = async () => {
  router.push('/admin/building/formbuilding')
}



const Building = ({ dorm_id }) => {
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])
  const router = useRouter()
  const { user } = userStore()

  const handleEdit = (id: string) => {
    router.push(`/admin/building/editBuilding/${id}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/admin/read/fetch_building').then(res => res.json())
        if (data) {
          setDormitoryBuilding(data)
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }, [])
  console.log('dormitoryBuilding:', dormitoryBuilding)

  const handleDeleteBuilding = async (dorm_id ,name) => {
    try {
      const response = await fetch('/api/admin/delete/building/deleteBuildingByID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dorm_id })
      })

      if (!response.ok) {
        throw new Error(`Response is not ok. Status: ${response.status}, Status Text: ${response.statusText}`)
      }

      // Assuming user is available in the scope
      console.log('name:', name)

      // Refresh the dormitoryBuilding data after successful deletion
      const { data } = await fetch('/api/admin/read/fetch_building').then(res => res.json())

      setDormitoryBuilding(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Card>
        <CardMedia
          sx={{ height: '20.375rem' }}
          image='https://cdn.pixabay.com/photo/2022/06/26/16/07/shop-7285838_1280.png'
        />
        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            Dormitory
          </Typography>
          <Typography variant='body2'>Click to add a dormitory. for building a new dormitory</Typography>
        </CardContent>
        <Button
          onClick={handleClick}
          variant='contained'
          sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          Add To Dormitory
        </Button>
      </Card>

      <Grid container spacing={3}>
        {dormitoryBuilding &&
          dormitoryBuilding.map(dorm => (
            <Grid key={dorm.dorm_id} item xs={12} sm={4}>
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardMedia component='img' height='140' image={dorm.images_url} alt='green iguana' />
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      {dorm.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {dorm.dorm_description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size='small' color='primary' onClick={() => handleEdit(dorm.dorm_id)}>
                    EDIT
                  </Button>
                  <DeleteBuilding
                    dorm_id={dorm.dorm_id}
                    name={dorm.name}
                    handleDeleteBuilding={handleDeleteBuilding} // ตรวจสอบว่า handleDeleteBuilding ที่นี่เป็นฟังก์ชัน
                  >
                    <Button size='small' color='primary'>
                      DELETE
                    </Button>
                  </DeleteBuilding>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  )
}

export default Building
