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
import * as React from 'react'
import Checkbox from '@mui/material/Checkbox'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

const activity = [
  { title: 'Basketball' },
  { title: 'Read a Book' },
  { title: 'Football' },
  { title: 'Play a game' },
  { title: 'Hang out' },
  { title: 'Watch a movie' },
  { title: 'Listen to music' },
  { title: 'Cooking' },
  { title: 'Travel' },
  { title: 'Shopping' },
  { title: 'Swimming' },
  { title: 'Running' },
  { title: 'Cycling' },
  { title: 'Tennis' },
  { title: 'Golf' },
  { title: 'Volleyball' },
  { title: 'Badminton' },
  { title: 'Table Tennis' },
  { title: 'Gym' },
  { title: 'Yoga' },
  { title: 'Dance' },
  { title: 'Meditation' },
  { title: 'Fishing' },
  { title: 'Photography' },
  { title: 'Drawing' },
  { title: 'Singing' },
  { title: 'Playing an instrument' },
  { title: 'Gardening' },
  { title: 'Hiking' },
  { title: 'Camping' },
  { title: 'Skiing' },
  { title: 'Snowboarding' },
  { title: 'Surfing' },
  { title: 'Skateboarding' },
  { title: 'Rollerblading' },
  { title: 'Ice Skating' },
  { title: 'Bowling' },
  { title: 'Billiards' },
  { title: 'Darts' },
  { title: 'Chess' },
  { title: 'Poker' },
  { title: 'Mahjong' },
  { title: 'Board Games' },
  { title: 'Video Games' },
  { title: 'Karaoke' },
  { title: 'Clubbing' },
  { title: 'Bar Hopping' },
  { title: 'Wine Tasting' }
]

const sleep = [{ title: 'Early Bird' }, { title: 'Night Owl' }, { title: 'Normal' }]

interface sleepType {
  title: string
}

const sleepTypeOption = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: sleepType) => option.title
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

const CreatePersonalityUser = () => {
  const { user } = userStore()

  const [profileData, setProfileData] = useState(null)

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
    phone: profileData?.data.phone,
    activity: profileData?.data.activity,
    personality_pros: profileData?.data.personality_pros,
    personality_cons: profileData?.data.personality_cons,
    sleep: profileData?.data.sleep
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
          phone: formData.phone,
          activity: formData.activity,
          personality_pros: formData.personality_pros,
          personality_cons: formData.personality_cons,
          sleep: formData.sleep
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            Edit Personality
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
      <Grid item xs={12} sm={12} md={12} lg={5}>
        <Box sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <CardContent>
            <form onSubmit={handleUserInfo}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <Typography variant='h5' sx={{ mb: 5, pl: 2, pt: 2 }}>
                    LIFE STYLE
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Autocomplete
                    multiple
                    id='checkboxes-tags-demo'
                    options={activity}
                    disableCloseOnSelect
                    getOptionLabel={option => option.title}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, activity: newValue.map(option => option.title).join(', ') })
                    }}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                        {option.title}
                      </li>
                    )}
                    style={{ width: 500 }}
                    renderInput={params => <TextField {...params} label='Activity' placeholder='Favorites' fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Autocomplete
                    id='filter-demo'
                    options={sleep}
                    getOptionLabel={option => option.title}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, sleep: newValue ? newValue.title : '' })
                    }}
                    style={{ width: 500 }}
                    renderInput={params => <TextField {...params} label='Sleep Style' fullWidth />}
                  />
                </Grid>

                <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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

export default CreatePersonalityUser
