// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Link from 'next/link'
import { CardMedia } from '@mui/material'

const CardGuid = () => {
  return (
    <Card
      sx={{
        mt: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
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
          href='https://drive.google.com/file/d/1cuT1acGp5kdY3aitRjE3nFQ4auTHqCfx/view?fbclid=IwZXh0bgNhZW0CMTAAAR0VQj6p6aIPxpIK1oES9VYfWVz9HiJwf65nM0mDE8DGE5pwdc4t1XQQ6bs_aem_AY1cgMrGuBn_NvakK8wV9_mkxmxQfX1eAfNTJP9r4LLdC5poiYjBlfrALedP_ibOGZ1CuulW7gXRBLrJmWQwWWD_'
          passHref
        >
          <a target='_blank' rel='noopener noreferrer'>
            <Button>Read More</Button>
          </a>
        </Link>
      </CardActions>
    </Card>
  )
}

export default CardGuid
