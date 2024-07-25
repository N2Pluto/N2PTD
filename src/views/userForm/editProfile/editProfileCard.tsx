import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'

const EditProfileCard = () => {
  const router = useRouter()

  const handleOpenForm = () => {
    router.push('/userGoogleForm/editCard/edit')
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card sx={{ width: '50%' }}>
        <CardMedia
          component='img'
          sx={{ height: '14rem', objectPosition: 'center' }}
          image='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/formedit4.jpg'
        />
        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            Edit Profile Form
          </Typography>
          <Typography variant='body2' sx={{ marginBottom: 2 }}>
            Please update your profile information to ensure it is accurate and up-to-date. You can edit the following
            details:
            <ul>
              <li>
                <strong>Student ID:</strong> Your unique student identification number.
              </li>
              <li>
                <strong>Name:</strong> Your first name.
              </li>
              <li>
                <strong>Surname:</strong> Your last name or family name.
              </li>
              <li>
                <strong>Gender:</strong> Your gender identification.
              </li>
              <li>
                <strong>Religion:</strong> Your religious affiliation, if any.
              </li>
              <li>
                <strong>Phone:</strong> Your current contact number.
              </li>
              <li>
                <strong>School:</strong> The school or faculty you are enrolled in.
              </li>
              <li>
                <strong>Department:</strong> The department within your school or faculty.
              </li>
              <li>
                <strong>Major:</strong> Your field of study or major.
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

export default EditProfileCard
