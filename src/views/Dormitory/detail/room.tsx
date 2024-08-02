import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import FeedIcon from '@mui/icons-material/Feed'
import AllInboxIcon from '@mui/icons-material/AllInbox'
import Chip from '@mui/material/Chip'
import { userStore } from 'src/stores/userStore'
import PersonIcon from '@mui/icons-material/Person'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { styled, keyframes } from '@mui/system'
import {
  CardActions,
  Divider,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Button
} from '@mui/material'
import React from 'react'

interface Column {
  id: 'DETAILS' | 'room' | 'code' | 'Viewdetails' | 'bedstatus'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'room', label: 'Room', minWidth: 30, align: 'center' },
  { id: 'code', label: 'Bed Capacity', minWidth: 150, align: 'center' },
  {
    id: 'bedstatus',
    label: 'Bed Status',
    minWidth: 170,
    align: 'center'
  }
]

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const StyledCard = styled(Card)(({ theme }) => ({
  animation: `${fadeIn} 0.6s ease-in-out`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: theme.spacing(3),
  '&:hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.02)',
    transition: 'all 0.3s ease-in-out'
  }
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  color: theme.palette.text.primary
}))

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const ReservationRoomDetails = () => {
  const router = useRouter()
  const [dormitoryBuilding, setDormitoryBuilding] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [loading, setLoading] = useState(false)
  const userStoreInstance = userStore()
  const { setUser } = userStoreInstance

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data } = await fetch(`/api/building/${router.query.id}`).then(res => res.json())
        setDormitoryBuilding(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
        setLoading(false)
      }
    }

    if (router.query.id) {
      fetchData()
    }
  }, [router.query.id])

  useEffect(() => {
    const fetchDataRoom = async () => {
      try {
        const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
        setDormitoryRoom(data)
        console.log(data)

      } catch (error) {
        console.error('Error fetching room data:', error)
      }
    }

    if (router.query.id) {
      fetchDataRoom()
    }
  }, [router.query.id])

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StyledTypography variant='body2' sx={{ whiteSpace: 'nowrap', pr: 3 }}>
                  Dormitory
                </StyledTypography>

                <FiberManualRecordIcon sx={{ fontSize: '5px' }} />

                <StyledTypography variant='body2' sx={{ whiteSpace: 'nowrap', pr: 3, pl: 3 }}>
                  Building
                </StyledTypography>

                <FiberManualRecordIcon sx={{ fontSize: '5px' }} />

                <StyledTypography variant='body2' sx={{ whiteSpace: 'nowrap', pr: 3, pl: 3 }}>
                  Room
                </StyledTypography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <StyledTypography variant='h5' sx={{ marginBottom: 2 }}>
                {dormitoryBuilding?.name}
              </StyledTypography>
              <Divider />
              <Grid container spacing={6} sx={{ pt: 5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 9, pt: 3 }}>
                      <img
                        src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/information_1945758.png'
                        alt='Information Icon'
                        style={{ width: 40, height: 40, marginRight: '8px' }} // Added margin-right
                      />
                      <StyledTypography variant='h6'>Information</StyledTypography>
                    </Box>
                    <Box sx={{ pl: 9, pt: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                        <StyledTypography variant='body1' sx={{ width: 150 }}>
                          Type building
                        </StyledTypography>
                        <StyledTypography variant='body1'>| {dormitoryBuilding?.type_building}</StyledTypography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                        <StyledTypography variant='body1' sx={{ width: 150 }}>
                          Gender
                        </StyledTypography>
                        <StyledTypography variant='body1'>| {dormitoryBuilding?.type_gender}</StyledTypography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                        <StyledTypography variant='body1' sx={{ width: 150 }}>
                          Price
                        </StyledTypography>
                        <StyledTypography variant='body1'>| {dormitoryBuilding?.price} baht / term</StyledTypography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                        <StyledTypography variant='body1' sx={{ width: 150 }}>
                          Bathroom
                        </StyledTypography>
                        <StyledTypography variant='body1'>| {dormitoryBuilding?.type_bathroom}</StyledTypography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                        <StyledTypography variant='body1' sx={{ width: 150 }}>
                          Roommate
                        </StyledTypography>
                        <StyledTypography variant='body1'>| {dormitoryBuilding?.type_roommate} Person</StyledTypography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                        <StyledTypography variant='body1' sx={{ width: 150 }}>
                          Bed type
                        </StyledTypography>
                        <StyledTypography variant='body1'>| {dormitoryBuilding?.type_bedtype}</StyledTypography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                        <StyledTypography variant='body1' sx={{ width: 150 }}>
                          Bed capacity
                        </StyledTypography>
                        <StyledTypography variant='body1'>| {dormitoryBuilding?.type_bedcapacity} bed</StyledTypography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                      <iframe
                        src={`http://maps.google.com/maps?q=${dormitoryBuilding?.latitude},${dormitoryBuilding?.longitude}&z=16&output=embed`}
                        height='275'
                        width='500'
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', pl: 3 }}>
                    <img
                      src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/welfare_2638077.png'
                      alt='Information Icon'
                      style={{ width: 40, height: 40, marginRight: '8px' }} // Added margin-right
                    />
                    <StyledTypography variant='h6'>Accommodation</StyledTypography>
                  </Box>
                  <Box sx={{ pl: 3, pt: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                      <StyledTypography variant='body1' sx={{ width: 150 }}>
                        Furniture
                      </StyledTypography>
                      <StyledTypography variant='body1'>
                        | {JSON.parse(dormitoryBuilding?.type_furniture || '[]').join(', ')}
                      </StyledTypography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                      <StyledTypography variant='body1' sx={{ width: 150 }}>
                        Facilities
                      </StyledTypography>
                      <StyledTypography variant='body1'>
                        | {JSON.parse(dormitoryBuilding?.type_facilities || '[]').join(', ')}
                      </StyledTypography>
                    </Box>
                  </Box>
                  <Divider />
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='h3' sx={{ marginBottom: 2, ml: 2 }}></Typography>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dormitoryRoom.map(room => (
                    <React.Fragment key={room.room_id}>
                      <TableRow hover role='checkbox' tabIndex={-1}>
                        <TableCell align='center'>{room.room_number}</TableCell>
                        <TableCell align='center'>
                          {Array.from({ length: room.bed_available }, (_, index) => (
                            <Tooltip title='This bed already reserve.' key={index}>
                              <PersonIcon color='primary' />
                            </Tooltip>
                          ))}

                          {Array.from({ length: room.bed_capacity - room.bed_available }, (_, index) => (
                            <Tooltip title='This bed is available' key={index}>
                              <PersonIcon />
                            </Tooltip>
                          ))}
                        </TableCell>
                        <TableCell align='center'>
                          {room.status ? (
                            <Chip label='Available' color='success' />
                          ) : (
                            <Chip label='Unavailable' color='error' />
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default ReservationRoomDetails
