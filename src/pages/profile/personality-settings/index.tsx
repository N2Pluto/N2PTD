import { useState, ElementType, SyntheticEvent, useEffect, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, { ButtonProps } from '@mui/material/Button'
import { ConsoleNetwork } from 'mdi-material-ui'
import { userStore } from 'src/stores/userStore'
import { user, setUser } from 'src/stores/userStore'
import router from 'next/router'
import Card from '@mui/material/Card'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import FooterIllustrationsV1 from '../pages/auth/FooterIllustration'
import { Divider } from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'

const school: SchoolOptionType[] = [
  {
    title: 'School of Management',
    course: ['Marketing Management', 'Logistics Management', 'Tourism and Hospitality'],
    major: ['Digital Marketing and Branding', 'Logistics Management', 'Hospitality Industry']
  },
  { title: 'School of Nursing', course: ['Nursing Science'], major: ['Nursing Science'] },
  {
    title: 'School of Political Science and Public Administration',
    course: ['Public Administration', 'Political Science'],
    major: ['Public Administration', 'Political Science']
  },
  {
    title: 'School of Engineering and Technology',
    course: [
      'Civil Engineering',
      'Electrical Engineering',
      'Materials Engineer',
      'Mechanical Engineer',
      'Chemical Engineer',
      'Computer Engineer'
    ],
    major: [
      'Civil Engineering',
      'Electrical Engineering',
      'Petrochemical and Polymer Engineering',
      'Mechanical and Robotic Engineering',
      'Chemical Engineering and Pharmaceutical Chemistry',
      'Computer Engineering and Artificial Intelligence'
    ]
  },
  {
    title: 'School of Architecture and Design',
    course: ['Architecture', 'Interior Architecture'],
    major: ['Architecture Program', 'Interior Design Program']
  },
  {
    title: 'School of Public Health',
    course: ['Public Health'],
    major: ['Public Health Program in Community Public Health']
  },
  { title: 'School of Medicine', course: ['Medicine'], major: ['Medicine Program'] },
  {
    title: 'School of Science',
    course: ['Physics', 'Chemistry', 'Biology'],
    major: ['Physical Program', 'Chemical Program', 'Biology Program']
  },
  {
    title: 'International College of Dentistry',
    course: ['Dental Surgery '],
    major: ['Doctor of Dental Surgery Program']
  },
  {
    title: 'Akkhraratchakumari Veterinary College',
    course: ['Veterinary Science'],
    major: ['Doctor of Veterinary Medicine Program']
  },
  { title: 'School of Accounting and Finance' },
  { title: 'School of Agricultural Technology and Food Industry' },
  { title: 'School of Law' },
  { title: 'International Veterinary College' },
  { title: 'Faculty of Liberal Arts' },
  { title: 'School of Information Science' },
  { title: 'School of Allied Health Sciences' }
]

interface SchoolOptionType {
  title: string
  course?: string[]
  major?: string[]
}

const schoolOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: SchoolOptionType) => option.title
})

const religion: ReligionOptionType = [
  { title: 'Buddhism' },
  { title: 'Christianity' },
  { title: 'Islam' },
  { title: 'Hinduism' },
  { title: 'Sikhism' },
  { title: 'Judaism' },
  { title: 'Baháʼí Faith' },
  { title: 'Jainism' },
  { title: 'Shinto' },
  { title: 'Cao Dai' },
  { title: 'Zoroastrianism' },
  { title: 'Tenrikyo' },
  { title: 'Wicca' },
  { title: 'Rastafari' },
  { title: 'Unitarian Universalism' },
  { title: 'Scientology' },
  { title: 'Bahaism' },
  { title: 'Paganism' },
  { title: 'Atheism' },
  { title: 'Agnosticism' },
  { title: 'Other' }
]

interface ReligionOptionType {
  title: string
}

const religionOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: string) => option
})

const ImgStyled = styled('img')(({ theme }) => ({
  width: 150,
  height: 150,
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const AccountSettings = () => {
  const { user } = userStore()

  const [profileData, setProfileData] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState<SchoolOptionType | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/fetchUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id }) // ส่ง user_id ไปยัง API
        })
        const data = await response.json()
        setProfileData(data) // เซ็ตข้อมูลผู้ใช้ที่ได้รับจาก API
        console.log(data)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])

  const [formData, setFormData] = useState({
    name: profileData?.data.name,
    lastname: profileData?.data.lastname,
    student_year: profileData?.data.student_year,
    school: profileData?.data.school,
    course: profileData?.data.course,
    religion: profileData?.data.religion,
    region: profileData?.data.region,
    major: profileData?.data.major,
    gender: profileData?.data.gender,
    facebook: profileData?.data.facebook,
    instagram: profileData?.data.instagram,
    phone: profileData?.data.phone
  })

  console.log('profileData', profileData)

  useEffect(() => {
    if (user?.student_id.toString().startsWith('63')) {
      // your code
      setFormData(prevState => ({ ...prevState, student_year: '4' }))
    }
    if (user?.student_id.toString().startsWith('64')) {
      // your code
      setFormData(prevState => ({ ...prevState, student_year: '3' }))
    }
    if (user?.student_id.toString().startsWith('65')) {
      // your code
      setFormData(prevState => ({ ...prevState, student_year: '2' }))
    }
    if (user?.student_id.toString().startsWith('66')) {
      // your code
      setFormData(prevState => ({ ...prevState, student_year: '1' }))
    }
  }, [user?.student_id])

  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const handleUserInfo = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/account-setting/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.user_id,
          name: formData.name,
          lastname: formData.lastname,
          student_year: formData.student_year,
          school: formData.school,
          course: formData.course,
          religion: formData.religion,
          region: formData.region,
          major: formData.major,
          gender: formData.gender,
          facebook: formData.facebook,
          instagram: formData.instagram,
          phone: formData.phone
        })
      })

      const { data, error } = await response.json()

      if (error) {
        console.error('Error Update data into USers table:', error.message)
      } else {
        console.log('Data Update Success:', data)
        alert('Data Update Success')
        router.push('/profile/')
      }
    } catch (error) {
      console.error('Error Update data into USers table:', error.message)
    }
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)

      reader.readAsDataURL(files[0])
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href='/dashboard' passHref>
            <Typography sx={{ whiteSpace: 'nowrap', pr: 3, color: 'text.primary' }} variant='body2'>
              Home
            </Typography>
          </Link>
          <FiberManualRecordIcon sx={{ fontSize: '5px' }} />
          <Link href='/profile' passHref>
            <Typography sx={{ whiteSpace: 'nowrap', pr: 3, pl: 3, color: 'text.primary' }} variant='body2'>
              Profile
            </Typography>
          </Link>
          <FiberManualRecordIcon sx={{ fontSize: '5px' }} />
          <Typography sx={{ whiteSpace: 'nowrap', pl: 3 }} variant='body2'>
            Edit Account
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={1} sm={1} md={1} lg={1}></Grid>
      <Grid item xs={12} sm={12} md={12} lg={5}>
        <Box sx={{ height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CardContent>
            <form onSubmit={handleUserInfo}>
              <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                <Box sx={{ alignItems: 'center', justifyItems: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ImgStyled src={imgSrc} alt='Profile Pic' />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant='body2' sx={{ marginTop: 5 }}>
                      Allowed PNG or JPEG. Max size of 800K.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                      Upload Photo
                      <input
                        hidden
                        type='file'
                        onChange={onChange}
                        accept='image/png, image/jpeg'
                        id='account-settings-upload-image'
                      />
                    </ButtonStyled>
                  </Box>
                </Box>
              </Grid>
            </form>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={5}>
        <Box sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <CardContent>
            <form onSubmit={handleUserInfo}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <Typography variant='h5' sx={{ mb: 3, pl: 2 }}>
                    Personal Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Student id' name='Student id' defaultValue={user?.student_id} disabled />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Email' name='Email' defaultValue={user?.email} disabled />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Student_Year'
                    name='student_year'
                    value={formData.student_year}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Gender ' name='Gender' defaultValue={user?.gender} disabled />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Name' name='name' value={formData.name} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Lastname'
                    name='lastname'
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Autocomplete
                    id='school-demo'
                    options={school}
                    getOptionLabel={option => option.title}
                    onChange={(event, newValue) => {
                      setSelectedSchool(newValue)
                      setSelectedCourse(null)
                      setFormData({ ...formData, school: newValue ? newValue.title : '' })
                    }}
                    renderInput={params => <TextField {...params} label='School' />}
                  />
                </Grid>

                {selectedSchool && selectedSchool.course && (
                  <Grid item xs={12} sm={12}>
                    <Autocomplete
                      id='course-demo'
                      options={selectedSchool.course}
                      getOptionLabel={option => option}
                      onChange={(event, newValue) => {
                        setSelectedCourse(newValue)
                        setFormData({ ...formData, course: newValue || '' })
                      }}
                      renderInput={params => <TextField {...params} label='Course' />}
                    />
                  </Grid>
                )}

                {selectedCourse && selectedSchool?.major && (
                  <Grid item xs={12} sm={12}>
                    <Autocomplete
                      id='major-demo'
                      options={selectedSchool.major}
                      getOptionLabel={option => option}
                      onChange={(event, newValue) => {
                        setFormData({ ...formData, major: newValue || '' })
                      }}
                      renderInput={params => <TextField {...params} label='Major' />}
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={12}>
                  <Autocomplete
                    id='filter-demo'
                    options={religion}
                    getOptionLabel={option => option.title}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, religion: newValue ? newValue.title : '' })
                    }}
                    renderInput={params => <TextField {...params} label='Religion' />}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Typography variant='h5' sx={{ mt: 3, mb: 3, pl: 2 }}>
                    Social
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label='Facebook'
                    name='facebook'
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Instagram'
                    name='instagram'
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label='Phone' name='phone' value={formData.phone} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type='submit' variant='contained' color='primary'>
                    SAVE CHANGES!
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Box>
      </Grid>
      <Grid item xs={1} sm={1} md={1} lg={1}></Grid>
      {/* <FooterIllustrationsV1 /> */}
    </Grid>
  )
}

export default AccountSettings
