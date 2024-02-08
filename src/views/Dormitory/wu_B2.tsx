// ** MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

const DormitorydetailsB2 = () => {
  return (
    <Card>
      <CardMedia sx={{ height: '14.5625rem' }} image='https://img5.pic.in.th/file/secure-sv1/wu.png' />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
        WU RESIDENCE B2
        </Typography>
        <Typography variant='body2'>
        Dormitory details
        </Typography>
      </CardContent>
    </Card>
  )
}

export default DormitorydetailsB2
