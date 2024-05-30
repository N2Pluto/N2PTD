import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { styled } from '@mui/material/styles'
import DeleteBuilding from './deleteBuilding'


const Building = ({ dorm_id }) => {
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])
  const router = useRouter()

  const handleClick = async () => {
    router.push('/admin/building/formbuilding')
  }


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

  const handleDeleteBuilding = async dorm_id => {
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
        <CardHeader title='Adding a building ' titleTypographyProps={{ variant: 'h6' }} />
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

      <Card>
      </Card>

      <Grid container spacing={3} sx={{ pt: 5 }}>
        {dormitoryBuilding && dormitoryBuilding.map(dorm => (
          <Grid item xs={12} sm={6} md={4} key={dorm.dorm_id}>
            <Card>
              <CardActionArea>
              <CardMedia sx={{ height: '14.5625rem' }} image={dorm.images_url} />
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
                <DeleteBuilding dorm_id={dorm.dorm_id} handleDeleteBuilding={handleDeleteBuilding}>
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
