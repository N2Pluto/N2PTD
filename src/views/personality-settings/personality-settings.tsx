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
import supabase from 'src/libs/supabase'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'

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

const redflag = [
  { title: 'Dirty' },
  { title: 'Smoke' },
  { title: 'Drink' },
  { title: 'Party' },
  { title: 'Play loud music' },
  { title: 'Bring friends over' },
  { title: 'Be messy' },
  { title: 'Be noisy' },
  { title: 'Be a night owl' },
  { title: 'Be a morning person' },
  { title: 'Be a pet owner' }
]

const sleep = [
  { title: 'Before Midnight' },
  { title: 'After Midnight' },
  { title: 'Some nights before midnight, some nights after midnight' }
]

interface sleepType {
  title: string
}

const sleepTypeOption = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: sleepType) => option.title
})

interface SchoolType {
  title: string
}

interface Major {
  title: string
}

const school: SchoolType[] = [
  {
    title: 'find roommates who attend the same school',
    majors: [
      { title: 'find roommates who study the same major' },
      { title: 'find roommates from any major' },
      { title: 'find all major' }
    ]
  },
  {
    title: 'find roommates from any school',
    majors: [{ title: 'find roommates from any major' }]
  },
  {
    title: 'find all school',
    majors: [
      { title: 'find roommates who study the same major' },
      { title: 'find roommates from any major' },
      { title: 'find all major' }
    ]
  }
]

const schoolTypeOption = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: SchoolType) => option.title
})

const religion = [
  { title: 'find roommates who have the same religion' },
  { title: 'find roommates from any religion' },
  { title: 'find all religion' }
]

interface religionType {
  title: string
}

const religionTypeOption = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: religionType) => option.title
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

const PersonalitySettings = () => {
  const { user } = userStore()
  const [profileData, setProfileData] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [majorOptions, setMajorOptions] = React.useState([])
  const [open, setOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const onChange = async (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)

      reader.readAsDataURL(files[0])

      // Format current date and time
      const now = new Date()
      const dateTimeFormat = `${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`
      const newFileName = `${dateTimeFormat}_${files[0].name}`

      // Upload file to Supabase with the new file name
      const filePath = `public/${newFileName}`
      const { error } = await supabase.storage.from('profile').upload(filePath, files[0])
      if (error) {
        console.error('Error uploading image: ', error.message)
      } else {
        console.log('Image uploaded successfully')
        const { data, error: urlError } = await supabase.storage.from('profile').getPublicUrl(filePath)
        if (urlError) {
          console.error('Error getting public URL: ', urlError.message)
        } else {
          const { publicUrl } = data
          setFormData(prevState => ({ ...prevState, image: publicUrl }))
          console.log('Image URL:', publicUrl)
        }
      }
    }
  }

  const handleOnChange = (event: ChangeEvent<Element>) => {
    onChange(event) // Call the original onChange function

    setOpen(true) // Show the Backdrop

    setTimeout(() => {
      setOpen(false)
    }, 3000)
  }

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
    activity: profileData?.userReqData.activity,
    sleep: profileData?.userReqData.sleep,
    filter_school: profileData?.userReqData.filter_school,
    filter_major: profileData?.userReqData.filter_major,
    filter_religion: profileData?.userReqData.filter_religion,
    filter_redflag: profileData?.userReqData.filter_redflag,
    image: profileData?.userInfoData.image
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
          activity: formData.activity,
          sleep: formData.sleep,
          filter_school: formData.filter_school,
          filter_major: formData.filter_major,
          filter_religion: formData.filter_religion,
          filter_redflag: formData.filter_redflag,
          image: formData.image
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
            Edit Requirement
          </Typography>
        </Box>
      </Grid>
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
                    Requirement
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Autocomplete
                    id='filter-demo'
                    options={school}
                    getOptionLabel={option => option.title}
                    onChange={(event, newValue) => {
                      setSelectedSchool(newValue) // เก็บข้อมูล school ที่ถูกเลือก
                      setFormData({ ...formData, filter_school: newValue ? newValue.title : '' })

                      // เมื่อโรงเรียนที่เลือกเปลี่ยนแปลง อัปเดต options ของ Autocomplete สำหรับ Major
                      setMajorOptions(newValue ? newValue.majors : [])
                    }}
                    style={{ width: 500 }}
                    renderInput={params => <TextField {...params} label='School Filter' fullWidth />}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  {selectedSchool && (
                    <Grid item xs={12} sm={12}>
                      <Autocomplete
                        id='filter-demo-major'
                        options={majorOptions} // ใช้ majorOptions แทน major ที่เปลี่ยนแปลงไปตามโรงเรียนที่เลือก
                        getOptionLabel={option => option.title}
                        onChange={(event, newValue) => {
                          setFormData({ ...formData, filter_major: newValue ? newValue.title : '' })
                        }}
                        style={{ width: 500 }}
                        renderInput={params => <TextField {...params} label='Major Filter' fullWidth />}
                      />
                    </Grid>
                  )}
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Autocomplete
                    id='filter-demo'
                    options={religion}
                    getOptionLabel={option => option.title}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, filter_religion: newValue ? newValue.title : '' })
                    }}
                    style={{ width: 500 }}
                    renderInput={params => <TextField {...params} label='Religion Filter' fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant='h5' sx={{ mb: 3, pl: 2 }}>
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
                    multiple
                    id='checkboxes-tags-demo'
                    options={redflag}
                    disableCloseOnSelect
                    getOptionLabel={option => option.title}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, filter_redflag: newValue.map(option => option.title).join(', ') })
                    }}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                        {option.title}
                      </li>
                    )}
                    style={{ width: 500 }}
                    renderInput={params => (
                      <TextField {...params} label='Red Flag Filter' placeholder='Favorites' fullWidth />
                    )}
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

export default PersonalitySettings
