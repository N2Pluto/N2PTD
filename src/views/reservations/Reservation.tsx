// ** MUI Imports
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
// import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CardMedia from '@mui/material/CardActions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AccountOutline, LockOpenOutline } from 'mdi-material-ui'
import { Divider } from '@mui/material'
import TrendingUp from 'mdi-material-ui/TrendingUp'
import StarOutline from 'mdi-material-ui/StarOutline'

const ReservationInfo = () => {
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const { data, error } = await supabase.from('Dormitory_Building').select('name , images_url').eq('dorm_id', 1)
        const { data } = await fetch('/api/fetch_building').then(res => res.json())
        // if (error) {
        //   throw error
        // }
        console.log('data:', data)
        setDormitoryBuilding(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }, [])

  const handleReservation = id => {
    // Handle the reservation with the card ID
    console.log('Reservation Building:', id)
  }

  return (
    <Grid item xs={12} md={6} lg={4}>
      {dormitoryBuilding.map(dorm => (
        <Grid item xs={12} md={12} lg={12} key={dorm.dorm_id}>
          <Card>
            <CardMedia sx={{ height: '14.5625rem' }} image={dormitoryBuilding[0]?.images_url} />
            <CardContent>
              <Typography variant='h6' sx={{ marginBottom: 2 }}>

              </Typography>
              <Typography variant='body2'>
                <>
                  - Dormitory fee: 10,000 baht per person per semester. <br /> - Monthly electricity bill payment.
                </>
              </Typography>
              <Link href={`reservations/reservations_room/${dorm.dorm_id}`}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pt: 5 }}>
                  <Button variant='contained'>See more detail</Button>
                </Box>
              </Link>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ReservationInfo

{
  /* <Card key={dorm.dorm_id}>
        <Grid
          item
          sm={5}
          xs={12}
          sx={{ paddingTop: ['0 !important', '1.5rem !important'], paddingLeft: ['1.5rem !important', '0 !important'] }}
        >
          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'action.hover',
              padding: theme => `${theme.spacing(18, 5, 16)} !important`
            }}
          >
            <Box>
              <Box sx={{ mb: 3.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Typography variant='h6'>$</Typography>
                <Typography variant='h6' sx={{ lineHeight: 1, fontWeight: 600, fontSize: '3.75rem !important' }}>
                  899
                </Typography>
                <Typography variant='h6'>USD</Typography>
              </Box>
              <Typography variant='body2' sx={{ mb: 13.75, display: 'flex', flexDirection: 'column' }}>
                <span>5 Tips For Offshore</span>
                <span>Software Development</span>
              </Typography>
              <Link href={`reservations/reservations_room/${dorm.dorm_id}`}>
              <Button variant='contained'>Contact Now</Button>
              </Link>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={7}>
          <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important` }}>
            <Typography variant='h6' sx={{ marginBottom: 3.5 }}>
              Lifetime Membership
            </Typography>
            <Typography variant='body2'>
              Here, I focus on a range of items and features that we use in life without giving them a second thought
              such as Coca Cola, body muscles and holding ones own breath. Though, most of these notes are not
              fundamentally necessary, they are such that you can use them for a good laugh, at a drinks party or for
              picking up women or men.
            </Typography>
            <Divider sx={{ marginTop: 6.5, marginBottom: 6.75 }} />
            <Grid container spacing={4}>
              <Grid item xs={12} sm={5}>
                <StyledBox>
                  <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                    <LockOpenOutline sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
                    <Typography variant='body2'>Full Access</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountOutline sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
                    <Typography variant='body2'>15 Members</Typography>
                  </Box>
                </StyledBox>
              </Grid>
              <Grid item xs={12} sm={7}>
                <Box sx={{ mb: 6.75, display: 'flex', alignItems: 'center' }}>
                  <StarOutline sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
                  <Typography variant='body2'>Access all Features</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: 'primary.main', marginRight: 2.75 }} fontSize='small' />
                  <Typography variant='body2'>Lifetime Free Update</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
    </Card> */
}

// <Card key={dorm.dorm_id} sx={{ mb: '1rem' }}>
//       <Box sx={{ mb: 1, display: 'flex' }}>
//         <Box component='img' src={dorm.images_url} sx={{ height: '20.5625rem' }} alt='logo'></Box>
//         <Typography
//           variant='h6'
//           sx={{
//             ml: 2,
//             lineHeight: 1,
//             fontWeight: 600,
//             textTransform: 'uppercase',
//             fontSize: '1.5rem !important'
//           }}
//         >
//           <CardContent>
//             <Typography variant='h6' sx={{ marginBottom: 2 }}>
//               {dorm.name}
//             </Typography>
//             <Typography variant='body2'>
//               - Dormitory fee: 10,000 baht per person per semester. <br /> - Monthly electricity bill payment.
//             </Typography>
//             <Link href={`reservations/reservations_room/${dorm.dorm_id}`}>
//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   flexWrap: 'wrap',
//                   justifyContent: 'end',
//                   pt: 35,
//                   pr: 2
//                 }}
//               >
//                 <Button variant='contained' onClick={() => handleReservation(dorm.dorm_id)}>
//                   Reservation Now!
//                 </Button>
//               </Box>
//             </Link>
//           </CardContent>
//         </Typography>
//       </Box>
//     </Card>
