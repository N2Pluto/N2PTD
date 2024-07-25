// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'

const TransferRoomCard = () => {
  const router = useRouter()

  const handleOpenForm = () => {
    router.push('/userGoogleForm/transferCard/transfer')
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ width: '50%' }}>
        <CardMedia
          sx={{ height: '14rem' }}
          image='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/form_transferRoom1.jpg'
        />
        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            Transfer Room Form
          </Typography>
          <Typography variant='body2' sx={{ marginBottom: 2 }}>
            Please submit a formal request to transfer your current room with another individual. Note that both parties
            must agree to the transfer. When filling out the form, you will be required to select the following:
            <ul>
              <li>
                <strong>Building:</strong> Choose the building you wish to transfer to.
              </li>
              <li>
                <strong>Room:</strong> Select the specific room within the chosen building.
              </li>
              <li>
                <strong>Bed:</strong> Choose your new bed within the selected room.
              </li>
            </ul>
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' sx={{ py: 2.5, width: '50%', borderRadius: 1 }} onClick={handleOpenForm}>
              Open Form
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default TransferRoomCard
