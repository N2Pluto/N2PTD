import { useState, ElementType, SyntheticEvent, useEffect, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import Button, { ButtonProps } from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { userStore } from 'src/stores/userStore'
import { user, setUser } from 'src/stores/userStore'
import router from 'next/router'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import CloseIcon from '@mui/icons-material/Close'
import { Divider } from '@mui/material'

const useStyles = makeStyles({
  success: {
    backgroundColor: '#4caf50'
  },
  error: {
    backgroundColor: '#f44336'
  }
})

const activity = [
  { title: 'Basketball', type: 'Sports' },
  { title: 'Football', type: 'Sports' },
  { title: 'Swimming', type: 'Sports' },
  { title: 'Volleyball', type: 'Sports' },
  { title: 'Tennis', type: 'Sports' },
  { title: 'Badminton', type: 'Sports' },
  { title: 'Table Tennis', type: 'Sports' },
  { title: 'Read a Book', type: 'Leisure' },
  { title: 'Cooking Class', type: 'Leisure' },
  { title: 'Gardening', type: 'Leisure' },
  { title: 'Yoga', type: 'Fitness' },
  { title: 'Jogging', type: 'Fitness' },
  { title: 'Dance Practice', type: 'Fitness' },
  { title: 'Weightlifting', type: 'Fitness' },
  { title: 'Cycling', type: 'Fitness' },
  { title: 'Meditation', type: 'Wellness' },
  { title: 'Spa Day', type: 'Wellness' },
  { title: 'Chess', type: 'Mind Games' },
  { title: 'Sudoku', type: 'Mind Games' },
  { title: 'Painting', type: 'Arts' },
  { title: 'Photography', type: 'Arts' },
  { title: 'Drawing', type: 'Arts' },
  { title: 'Guitar Practice', type: 'Music' },
  { title: 'Piano Practice', type: 'Music' },
  { title: 'Drama Club', type: 'Performing Arts' },
  { title: 'Coding Club', type: 'Technology' },
  { title: 'Robotics Club', type: 'Technology' },
  { title: 'Debate Club', type: 'Academics' },
  { title: 'Science Club', type: 'Academics' },
  { title: 'Volunteer Work', type: 'Community Service' },
  { title: 'Student Government', type: 'Leadership' }
]

const redflag = [
  { title: 'Dirty', type: 'Hygiene' },
  { title: 'Be messy', type: 'Hygiene' },
  { title: 'Leave dishes unwashed', type: 'Hygiene' },
  { title: 'Forget to take out trash', type: 'Hygiene' },
  { title: 'Not clean up after cooking', type: 'Hygiene' },
  { title: 'Smoke', type: 'Habit' },
  { title: 'Drink', type: 'Habit' },
  { title: 'Party', type: 'Social Behavior' },
  { title: 'Bring friends over', type: 'Social Behavior' },
  { title: 'Spread rumors', type: 'Social Behavior' },
  { title: 'Have frequent visitors', type: 'Social Behavior' },
  { title: 'Be noisy', type: 'Noise' },
  { title: 'Play loud music', type: 'Noise' },
  { title: 'Host loud gatherings', type: 'Noise' },
  { title: 'Be a night owl', type: 'Routine' },
  { title: 'Be a morning person', type: 'Routine' },
  { title: 'Be a pet owner', type: 'Living Preferences' },
  { title: 'Leave lights on', type: 'Energy Use' },
  { title: 'Leave doors unlocked', type: 'Security' },
  { title: 'Borrow things without asking', type: 'Respect' },
  { title: 'Invade personal space', type: 'Respect' },
  { title: 'Be careless with shared spaces', type: 'Respect' },
  { title: 'Be irresponsible with money', type: 'Finance' },
  { title: 'Be late on rent', type: 'Finance' },
  { title: 'Break things and not fix them', type: 'Responsibility' },
  { title: 'Not share chores', type: 'Responsibility' },
  { title: 'Ignore house rules', type: 'Responsibility' },
  { title: 'Be overly critical', type: 'Attitude' },
  { title: 'Be passive-aggressive', type: 'Attitude' },
  { title: 'Be confrontational', type: 'Attitude' }
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
  majors: Major[]
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

const PersonalitySettings = () => {
  const classes = useStyles()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const { user } = userStore()
  const [profileData, setProfileData] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null)
  const [majorOptions, setMajorOptions] = useState<Major[]>([])
  const [open, setOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

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

        // Set initial form data
        setFormData({
          activity: data?.userReqData.activity,
          sleep: data?.userReqData.sleep,
          filter_school: data?.userReqData.filter_school,
          filter_major: data?.userReqData.filter_major,
          filter_religion: data?.userReqData.filter_religion,
          filter_redflag: data?.userReqData.filter_redflag,
          image: data?.userInfoData.image
        })

        // Set initial school and major options
        const initialSchool = school.find(s => s.title === data?.userReqData.filter_school)
        if (initialSchool) {
          setSelectedSchool(initialSchool)
          setMajorOptions(initialSchool.majors)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])

  const [formData, setFormData] = useState({
    activity: '',
    sleep: '',
    filter_school: '',
    filter_major: '',
    filter_religion: '',
    filter_redflag: '',
    image: ''
  })

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
        console.error(error.message)
      } else {
        console.log('Data Update Success:', data)
        setSnackbarMessage('Data Update Success')
        setOpenSnackbar(true)
        setBackdropOpen(true) // Show backdrop
        setTimeout(() => {
          setBackdropOpen(false) // Hide backdrop
          router.push('/profile/')
        }, 2000) // 2-second delay
      }
    } catch (error) {
      console.error('Error Update data into USers table:', error.message)
    }
  }

  const [backdropOpen, setBackdropOpen] = useState(false)

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={backdropOpen}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 3, pl: 2 }}>
              <img
                src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/exam_6393087.png'
                alt='Requirement Icon'
                width={40}
                height={40}
                style={{ marginRight: 8 }}
              />
              <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center' }}>
                Edit Profile
              </Typography>
            </Box>
            <Divider />
            <Grid container spacing={1}>
              <Grid item xs={12} md={5}>
                <CardContent>
                  <form onSubmit={handleUserInfo}>
                    <Box sx={{ alignItems: 'center', justifyItems: 'center', textAlign: 'center', mt: 30 }}>
                      <ImgStyled src={formData.image ? formData.image : imgSrc} alt='Profile Pic' />
                      <Typography variant='body2' sx={{ marginTop: 5 }}>
                        Allowed PNG or JPG. Max size of 800K.
                      </Typography>
                      <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                        Upload Photo
                        <input
                          hidden
                          type='file'
                          onChange={handleOnChange}
                          accept='image/png, image/jpeg'
                          id='account-settings-upload-image'
                        />
                      </ButtonStyled>
                      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
                        <CircularProgress color='inherit' />
                      </Backdrop>
                    </Box>
                  </form>
                </CardContent>
              </Grid>

              <Grid item xs={12} md={6}>
                <CardContent>
                  <form onSubmit={handleUserInfo}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pl: 2 }}>
                        <img
                          src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/requirements_11337337.png'
                          alt='Requirement Icon'
                          width={40}
                          height={40}
                          style={{ marginRight: 8 }}
                        />
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          Requirement
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Autocomplete
                          id='filter-demo'
                          options={school}
                          value={selectedSchool}
                          getOptionLabel={option => option.title}
                          onChange={(event, newValue) => {
                            setSelectedSchool(newValue)
                            setFormData(prevState => ({
                              ...prevState,
                              filter_school: newValue ? newValue.title : '',
                              filter_major: ''
                            }))
                            setMajorOptions(newValue ? newValue.majors : [])
                          }}
                          renderInput={params => <TextField {...params} label='School Filter' fullWidth />}
                          sx={{ transform: 'scale(0.9)' }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        {selectedSchool && (
                          <Autocomplete
                            id='filter-demo-major'
                            options={majorOptions}
                            value={majorOptions.find(option => option.title === formData.filter_major) || null}
                            getOptionLabel={option => option.title}
                            onChange={(event, newValue) => {
                              setFormData(prevState => ({
                                ...prevState,
                                filter_major: newValue ? newValue.title : ''
                              }))
                            }}
                            renderInput={params => <TextField {...params} label='Major Filter' fullWidth />}
                            sx={{ transform: 'scale(0.9)' }}
                          />
                        )}
                      </Grid>

                      <Grid item xs={12}>
                        <Autocomplete
                          id='filter-demo-religion'
                          options={religion}
                          value={religion.find(option => option.title === formData.filter_religion) || null}
                          getOptionLabel={option => option.title}
                          onChange={(event, newValue) => {
                            setFormData(prevState => ({
                              ...prevState,
                              filter_religion: newValue ? newValue.title : ''
                            }))
                          }}
                          renderInput={params => <TextField {...params} label='Religion Filter' fullWidth />}
                          sx={{ transform: 'scale(0.9)' }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pl: 2 }}>
                          <img
                            src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/expectation_6193213.png'
                            alt='Lifestyle Icon'
                            width={40}
                            height={40}
                            style={{ marginRight: 8 }}
                          />
                          <Typography variant='body1' sx={{ fontWeight: 'bold', mt: 2 }}>
                            Lifestyle
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Autocomplete
                          multiple
                          id='checkboxes-tags-demo'
                          options={activity}
                          value={activity.filter(option => formData.activity?.includes(option.title))}
                          disableCloseOnSelect
                          getOptionLabel={option => option.title}
                          groupBy={option => option.type}
                          onChange={(event, newValue) => {
                            setFormData(prevState => ({
                              ...prevState,
                              activity: newValue.map(option => option.title).join(', ')
                            }))
                          }}
                          sx={{ transform: 'scale(0.9)' }}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option.title}
                            </li>
                          )}
                          renderInput={params => (
                            <TextField {...params} label='Activity' placeholder='Favorites' fullWidth />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Autocomplete
                          multiple
                          id='checkboxes-tags-demo-redflag'
                          options={redflag}
                          value={redflag.filter(option => formData.filter_redflag?.includes(option.title))}
                          disableCloseOnSelect
                          getOptionLabel={option => option.title}
                          groupBy={option => option.type}
                          onChange={(event, newValue) => {
                            setFormData(prevState => ({
                              ...prevState,
                              filter_redflag: newValue.map(option => option.title).join(', ')
                            }))
                          }}
                          sx={{ transform: 'scale(0.9)' }}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {option.title}
                            </li>
                          )}
                          renderInput={params => (
                            <TextField {...params} label='Red Flag Filter' placeholder='Favorites' fullWidth />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Autocomplete
                          id='filter-demo-sleep'
                          options={sleep}
                          value={sleep.find(option => option.title === formData.sleep) || null}
                          getOptionLabel={option => option.title}
                          onChange={(event, newValue) => {
                            setFormData(prevState => ({
                              ...prevState,
                              sleep: newValue ? newValue.title : ''
                            }))
                          }}
                          renderInput={params => <TextField {...params} label='Sleep Style' fullWidth />}
                          sx={{ transform: 'scale(0.9)' }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mr: 5 }}>
                        <Button type='submit' variant='contained' color='primary'>
                          SAVE CHANGES!
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {snackbarMessage}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleCloseSnackbar}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.success }}
      />
    </>
  )
}

export default PersonalitySettings
