// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'

const ChangeRoomCard = () => {
  const router = useRouter()

  const handleOpenForm = () => {
    router.push('/userGoogleForm/changeCard/change')
  }

  return (
    <Card>
      <CardMedia sx={{ height: '9.375rem' }} image='/images/cards/watch-on-hand.jpg' />
      <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          Change Room Form
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: 2 }}>
          At Walailak University, students have the option to request a change of dormitory rooms based on availability.
          Room changes are subject to the availability of vacant rooms within the university dormitories. Students are
          encouraged to specify their preferred building and room type when making a request. Please note that room
          changes can only be made to rooms that are currently unoccupied. The university strives to accommodate all
          requests in a timely and efficient manner, ensuring a smooth transition for students moving to a new room.
        </Typography>
      </CardContent>
      <Button
        variant='contained'
        sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        onClick={handleOpenForm}
      >
        Open Form
      </Button>
    </Card>
  )
}

export default ChangeRoomCard
