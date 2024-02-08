// ** MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'

const DormitorydetailsX = () => {
  return (
    <Card>
      <CardMedia sx={{ height: '14.5625rem' }} image='https://img5.pic.in.th/file/secure-sv1/wu.png' />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          WU Dormitory 10
        </Typography>
        <Typography variant='body2'>Dormitory details</Typography>
        <Link href='/'>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pt: 5 }}>
            <Button variant='contained'>See more detail</Button>
          </Box>
        </Link>
      </CardContent>
    </Card>
  )
}

export default DormitorydetailsX
