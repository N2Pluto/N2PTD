// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'
import { userStore } from 'src/stores/userStore'

import Link from 'next/link'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))



const TabAccountProfile = () => {
  const { user } = userStore()

  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')


  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='h5' sx={{ marginBottom: 1.5 }}>
              Student id
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                {' '}
                {user?.student_id}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='h5' sx={{ marginBottom: 1.5 }}>
              Email
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                {' '}
                {user?.email}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='h5' sx={{ marginBottom: 1.5 }}>
              Name
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                {' '}
                {user?.name}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='h5' sx={{ marginBottom: 1.5 }}>
              Lastname
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                {' '}
                {user?.lastname}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='h5' sx={{ marginBottom: 1.5 }}>
              School
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                {' '}
                {user?.school}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='h5' sx={{ marginBottom: 1.5 }}>
              Course
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ color: 'text.secondary' }}>
                {' '}
                {user?.course}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Link href='/profile/account-settings' passHref>
              <Button variant='contained' sx={{ marginRight: 3.5 }}>
                edit
              </Button>
            </Link>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccountProfile
