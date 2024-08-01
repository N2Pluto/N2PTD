// ** MUI Imports
import { Card, Button, Typography, CardHeader, CardContent, CardActions, CardMedia } from '@mui/material'
import Link from 'next/link'
import { styled } from '@mui/system'

// Styled Card Component with Hover Effect
const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  }
}))

const CardGuid = () => {
  return (
    <AnimatedCard
      sx={{
        mt: 2,
        borderRadius: 1
      }}
    >
      <CardMedia
        component='img'
        sx={{ width: '100%', height: 'auto' }}
        image='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/file-EGYxKgTJHLB8YZhiEsYZEjTY.jpg'
      />
      <CardHeader title='Preparing to Enter the Dormitory' />
      <CardContent>
        <Typography variant='body2' color='text.secondary'>
          This guide provides essential information for students preparing to enter the dormitory. Please read it
          carefully to ensure a smooth and successful move-in process.
        </Typography>
      </CardContent>
      <CardActions className='card-action-dense'>
        <Link
          href='https://drive.google.com/file/d/1cuT1acGp5kdY3aitRjE3nFQj6p6aIPxpIK1oES9VYfWVz9HiJwf65nM0mDE8DGE5pwdc4t1XQQ6bs_aem_AY1cgMrGuBn_NvakK8wV9_mkxmxQfX1eAfNTJP9r4LLdC5poiYjBlfrALedP_ibOGZ1CuulW7gXRBLrJmWQwWWD_'
          passHref
        >
          <a target='_blank' rel='noopener noreferrer'>
            <Button>Read More</Button>
          </a>
        </Link>
      </CardActions>
    </AnimatedCard>
  )
}

export default CardGuid
