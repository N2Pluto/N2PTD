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
        sx={{ height: '14.5625rem' }}
        image='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/w/Publie/Screenshot_2567-05-30_at_19.34.14.png?t=2024-05-30T12%3A36%3A58.183Z'
      />
      <CardHeader title='Preparing to enter the dormitory' />
      <CardContent></CardContent>
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
