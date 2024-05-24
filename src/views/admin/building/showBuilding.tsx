// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import router from 'next/router'

const CardShowBuilding = () => {
  // ** State
  const [collapse, setCollapse] = useState<boolean>(false)
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])

  const handleClick = () => {
    setCollapse(!collapse)
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

  return (
    dormitoryBuilding.map(dorm => (
      <Card key={dorm.dorm_id}>
      <CardMedia sx={{ height: '14.5625rem' }} image={dorm.images_url} />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
        {dorm.name}
        </Typography>
        <Typography variant='body2'>
          Although cards can support multiple actions, UI controls, and an overflow menu.
        </Typography>
      </CardContent>
      <CardActions className='card-action-dense'>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button onClick={handleClick}>Details</Button>
          <IconButton size='small' onClick={handleClick}>
            {collapse ? <ChevronUp sx={{ fontSize: '1.875rem' }} /> : <ChevronDown sx={{ fontSize: '1.875rem' }} />}
          </IconButton>
        </Box>
      </CardActions>
      <Collapse in={collapse}>
        <Divider sx={{ margin: 0 }} />
        <CardContent>
          <Typography variant='body2'>
          <Button size='small' color='primary' onClick={() => handleEdit(dorm.dorm_id)}>
                  EDIT
                </Button>

                <DeleteBuilding dorm_id={dorm.dorm_id} handleDeleteBuilding={handleDeleteBuilding}>
                  <Button size='small' color='primary'>
                    DELETE
                  </Button>
                </DeleteBuildig>
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
    ))


  )
}

export default CardShowBuilding
