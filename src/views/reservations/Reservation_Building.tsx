// ** MUI Imports
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
// import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Grid, { GridProps } from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// ** Icons Imports
import Twitter from 'mdi-material-ui/Twitter'
import CartPlus from 'mdi-material-ui/CartPlus'
import Facebook from 'mdi-material-ui/Facebook'
import Linkedin from 'mdi-material-ui/Linkedin'
import GooglePlus from 'mdi-material-ui/GooglePlus'
import ShareVariant from 'mdi-material-ui/ShareVariant'
import { CardActions } from '@mui/material'

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const ReservationBuilding = () => {
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const { data, error } = await supabase.from('Dormitory_Building').select('name , images_url').eq('dorm_id', 1)
        const { data } = await fetch('/api/fetch_building').then(res => res.json())
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      {dormitoryBuilding.map(dorm => (
        <Grid key={dorm.dorm_id} pb={5}>
          <Card>
            <Grid container spacing={6}>
              <StyledGrid item md={5} xs={12}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                <img width={300} height={300} alt='dom img' src={dorm.images_url} />


                </CardContent>
              </StyledGrid>
              <Grid
                item
                xs={12}
                md={7}
                sx={{
                  paddingTop: ['0 !important', '0 !important', '1.5rem !important'],
                  paddingLeft: ['1.5rem !important', '1.5rem !important', '0 !important']
                }}
              >
                <CardContent>
                  <Typography variant='h6' sx={{ marginBottom: 2 }}>
                    {dorm.name}
                  </Typography>
                  <Typography variant='body2' sx={{ marginBottom: 3.5 }}>
                  - Dormitory fee: 10,000 baht per person per semester. <br /> - Monthly electricity bill payment.
                  </Typography>
                  <Typography sx={{ fontWeight: 500, marginBottom: 3 }}>
                  Gender :{' '}
                    <Box component='span' sx={{ fontWeight: 'bold' }}>
                    {dorm.type_gender}
                    </Box>
                  </Typography>
                </CardContent>
                <CardActions className='card-action-dense'>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Link href={`reservations/reservations_room/${dorm.dorm_id}`}>
                      <Button>
                        <CartPlus fontSize='small' sx={{ marginRight: 2 }} />
                        Reservation Now!
                      </Button>
                    </Link>

                    <IconButton
                      id='long-button'
                      aria-label='share'
                      aria-haspopup='true'
                      onClick={handleClick}
                      aria-controls='long-menu'
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <ShareVariant fontSize='small' />
                    </IconButton>
                    <Menu
                      open={open}
                      id='long-menu'
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'long-button'
                      }}
                    >
                      <MenuItem onClick={handleClose}>
                        <Facebook />
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Twitter />
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Linkedin />
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <GooglePlus />
                      </MenuItem>
                    </Menu>
                  </Box>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        // <Card key={dorm.dorm_id} sx={{ mb: '1rem' }}>
        //   <Box sx={{ mb: 0, display: 'flex' }}>
        //     <Box component='img' src={dorm.images_url} sx={{ height: '20.5625rem' }} alt='logo'></Box>
        //     <Typography
        //       variant='h6'
        //       sx={{
        //         ml: 3,
        //         lineHeight: 1,
        //         fontWeight: 600,
        //         textTransform: 'uppercase',
        //         fontSize: '1.5rem !important'
        //       }}
        //     >
        //       <CardContent>
        //         <Typography variant='h6' sx={{ marginBottom: 2 }}>
        //           {dorm.name}
        //         </Typography>
        //         <Typography variant='body2'>
        //           - Dormitory fee: 10,000 baht per person per semester. <br /> - Monthly electricity bill payment.
        //         </Typography>
        //         <Typography variant='body2'>
        //           Gender : {dorm.type_gender}
        //         </Typography>
        //         <Link href={`reservations/reservations_room/${dorm.dorm_id}`}>
        //           <Box
        //             sx={{
        //               display: 'flex',
        //               alignItems: 'center',
        //               flexWrap: 'wrap',
        //               justifyContent: 'end',
        //               pt: 35,
        //               pr: 2
        //             }}
        //           >
        //             <Button variant='contained' onClick={() => handleReservation(dorm.dorm_id)}>
        //               Reservation Now!
        //             </Button>
        //           </Box>
        //         </Link>
        //       </CardContent>
        //     </Typography>
        //   </Box>
        // </Card>
      ))}
    </>
  )
}

export default ReservationBuilding

// import { useEffect, useState } from 'react'

// const ReservationBuilding = () => {
//   const [dormitoryBuilding, setDormitoryBuilding] = useState([])
//   const [filter, setFilter] = useState('')

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await fetch('/api/fetch_building').then(res => res.json())
//         console.log('data:', data)
//         setDormitoryBuilding(data)
//       } catch (error) {
//         console.error('Error fetching dormitory building data:', error)
//       }
//     }

//     fetchData()
//   }, [])

//   const handleFilterChange = (event) => {
//     setFilter(event.target.value)
//   }

//   const filteredDormitoryBuilding = dormitoryBuilding.filter(dorm => dorm.name.includes(filter))

//   // ... rest of the component
// }

// // In the render method, use the filteredDormitoryBuilding instead of dormitoryBuilding
// {filteredDormitoryBuilding.map(dorm => (
//   // ... rest of the map function
// ))}
