import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid, { GridProps } from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Twitter from 'mdi-material-ui/Twitter';
import CartPlus from 'mdi-material-ui/CartPlus';
import Facebook from 'mdi-material-ui/Facebook';
import Linkedin from 'mdi-material-ui/Linkedin';
import GooglePlus from 'mdi-material-ui/GooglePlus';
import ShareVariant from 'mdi-material-ui/ShareVariant';
import { CardActions } from '@mui/material';
import { Collapse, Divider } from '@mui/material';
import { userStore, IUser } from 'src/stores/userStore'

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
}));

const ReservationBuilding = () => {
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])
  const [genderFilter, setGenderFilter] = useState<string>('')
  const [collapse, setCollapse] = useState<boolean>(false)
   const userStoreInstance = userStore()
   const { setUser } = userStoreInstance
  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

 const handleReservation = (dorm_id: string) => {
   if (dorm_id) {
     console.log('Reservation Building:', dorm_id)
     setUser({ ...userStoreInstance.user, dorm_id }) 
     console.log('user:', userStoreInstance.user)
     router.push(`/reservations/reservations_room/${dorm_id}`)
   } else {
     console.error('Invalid dorm_id:', dorm_id)
   }
 }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/fetch_building').then(res => res.json())
        console.log('data:', data)
        setDormitoryBuilding(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick1 = () => {
    setCollapse(!collapse)
  }

  return (
    <>
      <Grid pb={4}>
        <Card>
          <CardContent>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button onClick={handleClick1}>Filter Gender</Button>
            </Box>
            <Collapse in={collapse}>
              <Divider sx={{ margin: 0 }} />
              <CardContent>
                <Button onClick={() => setGenderFilter('')}>All</Button>
                <Button onClick={() => setGenderFilter('male')}>Male</Button>
                <Button onClick={() => setGenderFilter('female')}>Female</Button>
              </CardContent>
            </Collapse>
          </CardContent>
        </Card>
      </Grid>

      {dormitoryBuilding
        .filter(dorm => genderFilter === '' || dorm.type_gender === genderFilter)
        .map(dorm => (
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
                      <Button onClick={() => handleReservation(dorm.dorm_id)}>
                        <CartPlus fontSize='small' sx={{ marginRight: 2 }} />
                        Reservation Now!
                      </Button>

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
        ))}
      <Box></Box>
    </>
  )
}

export default ReservationBuilding;
