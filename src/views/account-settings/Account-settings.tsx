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
import { Backdrop, CircularProgress, Divider } from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import supabase from 'src/libs/supabase'

const school: SchoolOptionType[] = [
  {
    title: 'School of Management',
    departments: [
      {
        name: 'Marketing Management',
        majors: ['Digital Marketing and Branding']
      },
      {
        name: 'Logistics Management',
        majors: ['Logistics Management']
      },
      {
        name: 'Tourism and Hospitality',
        majors: ['Hospitality Industry']
      }
    ]
  },
  {
    title: 'School of Nursing',
    departments: [
      {
        name: 'Nursing Science',
        majors: ['Nursing Science Program']
      }
    ]
  },
  {
    title: 'School of Political Science and Public Administration',
    departments: [
      {
        name: 'Public Administration',
        majors: ['Public Administration Program']
      },
      {
        name: 'Political Science',
        majors: ['Political Science Program']
      }
    ]
  },
  {
    title: 'School of Engineering and Technology',
    departments: [
      {
        name: 'Civil Engineering',
        majors: ['Civil Engineering Program']
      },
      {
        name: 'Electrical Engineering',
        majors: ['Electrical Engineering Program']
      },
      {
        name: 'Materials Engineer',
        majors: ['Petrochemical and Polymer Engineering']
      },
      {
        name: 'Mechanical Engineer',
        majors: ['Mechanical and Robotic Engineering']
      },
      {
        name: 'Chemical Engineer',
        majors: ['Chemical Engineering and Pharmaceutical Chemistry']
      },
      {
        name: 'Computer Engineer',
        majors: ['Computer Engineering and Artificial Intelligence']
      }
    ]
  },
  {
    title: 'School of Architecture and Design',
    departments: [
      {
        name: 'Architecture',
        majors: ['Architecture Program']
      },
      {
        name: 'Interior Architecture',
        majors: ['Interior Design Program']
      }
    ]
  },
  {
    title: 'School of Public Health',
    departments: [
      {
        name: 'Public Health',
        majors: ['Public Health Program in Community Public Health']
      }
    ]
  },
  {
    title: 'School of Medicine',
    departments: [
      {
        name: 'Medicine',
        majors: ['Medicine Program']
      }
    ]
  },
  {
    title: 'School of Science',
    departments: [
      {
        name: 'Mathematics',
        majors: ['Mathematics Program']
      },
      {
        name: 'Physics',
        majors: ['Physics Program']
      },
      {
        name: 'Chemistry',
        majors: ['Chemistry Program']
      },
      {
        name: 'Biology',
        majors: ['Biology Program']
      }
    ]
  },
  {
    title: 'International College of Dentistry',
    departments: [
      {
        name: 'Dental Surgery',
        majors: ['Doctor of Dental Surgery Program']
      }
    ]
  },
  {
    title: 'Akkhraratchakumari Veterinary College',
    departments: [
      {
        name: 'Veterinary Science',
        majors: ['Doctor of Veterinary Medicine Program']
      }
    ]
  },
  {
    title: 'School of Accounting and Finance',
    departments: [
      {
        name: 'Accounting and Finance',
        majors: [
          'Business Administration (Digital Age Business and Financial Management)',
          'Business Administration, Finance, and Economics (Digital Age Business and Financial Management, Economics)',
          'Accounting',
          'Economics'
        ]
      }
    ]
  },
  {
    title: 'School of Law',
    departments: [
      {
        name: 'Law',
        majors: ['Bachelor of Laws']
      }
    ]
  },
  {
    title: 'Faculty of Liberal Arts',
    departments: [
      {
        name: 'Education',
        majors: [
          'Education (Mathematics)',
          'Education (Computer Studies)',
          'Education (Dramatic Arts)',
          'Education (Early Childhood)',
          'Education (Biology)',
          'Education (Physical Education)',
          'Education (Thai Language)',
          'Education (English Language)',
          'Education (General Science)',
          'Education (Social Studies)'
        ]
      },
      {
        name: 'Liberal Arts',
        majors: [
          'Bachelor of Arts Program in Chinese',
          'Bachelor of Arts Program in English',
          'Bachelor of Arts (Thai Language for Communication)'
        ]
      }
    ]
  },

  {
    title: 'School of Information Science',
    departments: [
      {
        name: 'Information Science',
        majors: [
          'Digital Content and Media',
          'Digital Technology in Medicine',
          'Digital Communication Arts',
          'Intelligent Information Technology',
          'Interactive Multimedia, Animation, and Games'
        ]
      }
    ]
  },
  {
    title: 'School of Allied Health Sciences',
    departments: [
      {
        name: 'Physical Therapy',
        majors: ['Physical Therapy Program']
      },
      {
        name: 'Medical Technology',
        majors: ['Medical Technology Program', 'Medical Technology (International)']
      }
    ]
  },
  {
    title: 'School of Agricultural Technology and food Industry',
    departments: [
      {
        name: 'Agricultural Technology',
        majors: ['Agriculture and Innovation']
      },
      {
        name: 'Food Industry',
        majors: ['Food Science and Innovation']
      }
    ]
  },
  {
    title: 'School of Pharmacy',
    departments: [
      {
        name: 'Pharmacy',
        majors: ['Pharmacy Program']
      }
    ]
  },

  {
    title: 'International College',
    departments: [
      {
        name: 'Business Administration (International)',
        majors: ['Business Administration (International) Program']
      }
    ]
  }
]

interface DepartmentOptionType {
  name: string
  majors: string[]
}

interface SchoolOptionType {
  title: string
  departments: DepartmentOptionType[]
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
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

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
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])

  const [formData, setFormData] = useState({
    name: profileData?.userInfoData.name,
    lastname: profileData?.userInfoData.lastname,
    student_year: profileData?.userInfoData.student_year,
    school: profileData?.userInfoData.school,
    department: profileData?.userInfoData.department,
    religion: profileData?.userInfoData.religion,
    region: profileData?.userInfoData.region,
    major: profileData?.userInfoData.major,
    gender: profileData?.userInfoData.gender,
    facebook: profileData?.userInfoData.facebook,
    instagram: profileData?.userInfoData.instagram,
    phone: profileData?.userInfoData.phone,
    image: profileData?.userInfoData.image
  })


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

  const onChange = async (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)

      reader.readAsDataURL(files[0])

      // Upload file to Supabase
      const filePath = `public/${files[0].name}`
      const { error } = await supabase.storage.from('profile').upload(filePath, files[0])
      if (error) {
        console.error('Error uploading image: ', error.message)
      } else {
        const { data, error: urlError } = await supabase.storage.from('profile').getPublicUrl(filePath)
        if (urlError) {
          console.error('Error getting public URL: ', urlError.message)
        } else {
          const { publicUrl } = data
          setFormData(prevState => ({ ...prevState, image: publicUrl }))
        }
      }
    }
  }

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
          department: formData.department,
          religion: formData.religion,
          region: formData.region,
          major: formData.major,
          gender: formData.gender,
          facebook: formData.facebook,
          instagram: formData.instagram,
          phone: formData.phone,
          image: formData.image // Ensure image URL is being sent in the request
        })
      })

      const { data, error } = await response.json()

      if (error) {
        console.error('Error Update data into Users table:', error.message)
      } else {
        alert('Data Update Success')
        router.push('/profile/')
      }
    } catch (error) {
      console.error('Error Update data into Users table:', error.message)
    }
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const [open, setOpen] = useState(false)

  const handleOnChange = (event: ChangeEvent<Element>) => {
    onChange(event) // Call the original onChange function

    setOpen(true) // Show the Backdrop

    // Hide the Backdrop after 5 seconds
    setTimeout(() => {
      setOpen(false)
    }, 3000)
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
                      Allowed PNG or JPG. Max size of 800K.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                      Upload Photo
                      <input
                        hidden
                        type='file'
                        onChange={handleOnChange}
                        accept='image/png, image/jpeg , image/JPG, image/jpg, image/JPEG, image/PNG'
                        id='account-settings-upload-image'
                      />
                    </ButtonStyled>

                    <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
                      <CircularProgress color='inherit' />
                    </Backdrop>
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
                    Requirement Information
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
                    renderInput={params => <TextField {...params} label='School' required />}
                  />
                </Grid>
                {/* ...rest of your Grid items */}

                {selectedSchool && (
                  <Grid item xs={12} sm={12}>
                    <Autocomplete
                      id='department-demo'
                      options={selectedSchool.departments}
                      getOptionLabel={option => option.name}
                      onChange={(event, newValue) => {
                        setSelectedDepartment(newValue)
                        setFormData({ ...formData, department: newValue ? newValue.name : '' })
                      }}
                      renderInput={params => <TextField {...params} label='Department' required />}
                    />
                  </Grid>
                )}

                {selectedDepartment && (
                  <Grid item xs={12} sm={12}>
                    <Autocomplete
                      id='major-demo'
                      options={selectedDepartment.majors}
                      getOptionLabel={option => option}
                      onChange={(event, newValue) => {
                        setFormData({ ...formData, major: newValue || '' })
                      }}
                      renderInput={params => <TextField {...params} label='Major' required />}
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
