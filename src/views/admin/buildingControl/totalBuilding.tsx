import { ReactNode, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import KingBedIcon from '@mui/icons-material/KingBed'

const TotalBuilding = () => {
  const [building, setBuilding] = useState([])
  const [room, setRoom] = useState([])
  const [bed, setBed] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/building/fetch_building').then(res => res.json())
        setBuilding(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/room/fetch_room').then(res => res.json())
        setRoom(data)
      } catch (error) {
        console.error('Error fetching dormitory room data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/bed/fetch_bed').then(res => res.json())
        setBed(data)
      } catch (error) {
        console.error('Error fetching dormitory bed data:', error)
      }
    }
    fetchData()
  }, [])

  

  const freeRoom = room.filter(b => b.status === true).length
  const reservedRoom = room.filter(b => b.status === false).length


  const freeBeds = bed.filter(b => b.bed_status === true).length
  const reservedBeds = bed.filter(b => b.bed_status === false).length

  const data = [
    {
      name: building.length,
      title: 'Building',
      avatarText: <CorporateFareIcon />,
      avatarColor: 'success',
    },
    {
      name: `Room All : ${room.length} | Free : ${freeRoom} | Reserved : ${reservedRoom}`,
      title: 'Room',
      avatarText: <BedroomParentIcon />,
      avatarColor: 'error'
    },
    {
      name: `Bed All : ${bed.length} | Free : ${freeBeds} | Reserved : ${reservedBeds}`,
      title: 'Bed',
      avatarText: <KingBedIcon />,
      avatarColor: 'warning',
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Total All'
        titleTypographyProps={{ sx: { lineHeight: '1.2 !important', letterSpacing: '0.31px !important' } }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
        {data.map((item, index) => (
          <Box
            key={item.title}
            sx={{
              display: 'flex',
              alignItems: 'center',
              ...(index !== data.length - 1 ? { mb: 5.875 } : {})
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                marginRight: 3,
                fontSize: '1rem',
                color: 'common.white',
                backgroundColor: `${item.avatarColor}.main`
              }}
            >
              {item.avatarText}
            </Avatar>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mr: 0.5, fontWeight: 600, letterSpacing: '0.25px' }}>{item.title}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', textAlign: 'end', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.72, letterSpacing: '0.22px' }}>
                  {item.name}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

export default TotalBuilding
