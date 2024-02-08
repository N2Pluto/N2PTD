// ** MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

const DormitorydetailsXVI = () => {
  return (
    <Card>
      <CardMedia sx={{ height: '14.5625rem' }} image='https://img5.pic.in.th/file/secure-sv1/wu.png' />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
        WU Dormitory 15
        </Typography>
        <Typography variant='body2'>
        Dormitory details
        </Typography>
      </CardContent>
    </Card>
  )
}

export default DormitorydetailsXVI
