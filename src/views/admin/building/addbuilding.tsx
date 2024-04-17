import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import router from 'next/router'
import { sendDiscordMessage } from 'src/pages/api/discord/admin'

const handleClick = async () => {
  router.push('/admin/building/formbuilding')
}

const testhandleClick = async () => {
  await sendDiscordMessage('Hello World!')
  console.log('test')
}

const Addbuilding = () => {
  return (
    <Card>
      <CardMedia
        sx={{ height: '20.375rem' }}
        image='https://cdn.pixabay.com/photo/2022/06/26/16/07/shop-7285838_1280.png'
      />
      <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Dormitory
        </Typography>
        <Typography variant='body2'>Click to add a dormitory. for building a new dormitory</Typography>
      </CardContent>
      <Button
        onClick={handleClick}
        variant='contained'
        sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      >
        Add To Dormitory
      </Button>
      <Button
        onClick={testhandleClick}
        variant='contained'
        sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      >
        test
      </Button>
    </Card>
  )
}

export default Addbuilding
