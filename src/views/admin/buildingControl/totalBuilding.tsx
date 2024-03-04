// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** icons
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import KingBedIcon from '@mui/icons-material/KingBed';

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

  console.log('building', building)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/room/fetch_room').then(res => res.json())
        setRoom(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }
    fetchData()
  }, [])

  console.log('room', room)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/bed/fetch_bed').then(res => res.json())
        setBed(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }
    fetchData()
  }, [])

  console.log('bed', bed)

  interface DataType {
    title: string
    name: ReactNode
    avatarText: ReactNode
    avatarColor: ThemeColor
  }

  const data: DataType[] = [
    {
      name: (
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.72, letterSpacing: '0.22px' }}>
          {building.length}
        </Typography>
      ),
      title: 'Building',
      avatarText: <CorporateFareIcon />,
      avatarColor: 'success'
    },
    {
      name: (
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.72, letterSpacing: '0.22px' }}>
          {room.length}
        </Typography>
      ),
      title: 'Room',
      avatarText: <BedroomParentIcon />,
      avatarColor: 'error'
    },
    {
      name: (
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.72, letterSpacing: '0.22px' }}>
          {bed.length}
        </Typography>
      ),
      title: 'Bed',
      avatarText: <KingBedIcon />,
      avatarColor: 'warning'
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Total All'
        titleTypographyProps={{ sx: { lineHeight: '1.2 !important', letterSpacing: '0.31px !important' } }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
        {data.map((item: DataType, index: number) => {
          return (
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}></Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', textAlign: 'end', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.72, letterSpacing: '0.22px' }}>
                    {item.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default TotalBuilding
