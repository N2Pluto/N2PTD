import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Box,
  Grid,
  TextField,
  Typography,
  CardContent,
  Button,
  Card,
  Divider,
  Checkbox,
  Autocomplete,
  Paper,
  Snackbar,
  Alert
} from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

// Custom Imports
import { userStore } from 'src/stores/userStore'
import DormitoryFooter from '../pages/auth/DormitoryFooter'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

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

const school = [
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

const religion = [
  { title: 'find roommates who have the same religion' },
  { title: 'find roommates from any religion' },
  { title: 'find all religion' }
]

const CreatePersonalityUser = () => {
  const { user } = userStore()
  const router = useRouter()

  const [profileData, setProfileData] = useState(null)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [majorOptions, setMajorOptions] = useState([])
  const [selectedOptions, setSelectedOptions] = useState([])
  const [formData, setFormData] = useState({})
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/fetchUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id })
        })
        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }
    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])

  useEffect(() => {
    const fetchYearSystem = async () => {
      try {
        const response = await fetch('/api/admin/yearSystem/read', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        const yearSystem = data.find(item => item.student_id.startsWith(user?.student_id.toString().slice(0, 2)))
        if (yearSystem) {
          setFormData(prevState => ({ ...prevState, student_year: yearSystem.year }))
        }
      } catch (error) {
        console.error('Error fetching year system:', error)
      }
    }
    if (user?.student_id) {
      fetchYearSystem()
    }
  }, [user?.student_id])

  const handleUserInfo = async e => {
    e.preventDefault()
    try {
      const response = await fetch('/api/account-setting/createReq', {
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
          filter_redflag: formData.filter_redflag
        })
      })
      const { data, error } = await response.json()
      if (error) {
        console.error('Error Update data into Users table:', error.message)
      } else {
        const responseUserInfo = await fetch('/api/account-setting/createUserInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id })
        })
        const { data: userInfoData, error: userInfoError } = await responseUserInfo.json()
        if (userInfoError) {
          console.error('Error Update data into Users_Info table:', userInfoError.message)
        } else {
          setSnackbarMessage('Data Update Success')
          setOpenSnackbar(true)
        }
        router.push('/profile/')
      }
    } catch (error) {
      console.error('Error Update data into Users table:', error.message)
    }
  }

  const handleChange = e => {
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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <Box sx={{ margin: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Grid container spacing={3} justifyContent='center'>
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Box sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <CardContent>
                <form onSubmit={handleUserInfo}>
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, pl: 2 }}>
                        <img
                          src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/exam_6393087.png'
                          alt='Requirement Icon'
                          width={40}
                          height={40}
                          style={{ marginRight: 8 }}
                        />
                        <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
                          Form for First-Time Users
                        </Typography>
                      </Box>
                      <Divider />

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pl: 2 }}>
                        <img
                          src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/requirements_11337337.png'
                          alt='Requirement Icon'
                          width={40}
                          height={40}
                          style={{ marginRight: 8 }}
                        />
                        <Typography variant='body1'>Requirement</Typography>
                      </Box>
                      <Typography variant='body2' sx={{ mt: -2, mb: 2, ml: 14 }}>
                        Please fill in the requirement for first-time users.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Autocomplete
                        id='filter-demo'
                        options={school}
                        getOptionLabel={option => option.title}
                        onChange={(event, newValue) => {
                          setSelectedSchool(newValue)
                          setFormData({ ...formData, filter_school: newValue ? newValue.title : '' })
                          setMajorOptions(newValue ? newValue.majors : [])
                        }}
                        style={{ width: '100%' }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='School Filter'
                            fullWidth
                            required
                            helperText='Select your school'
                            sx={{ transform: 'scale(0.9)' }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      {selectedSchool && (
                        <Autocomplete
                          id='filter-demo-major'
                          options={majorOptions}
                          getOptionLabel={option => option.title}
                          onChange={(event, newValue) => {
                            setFormData({ ...formData, filter_major: newValue ? newValue.title : '' })
                          }}
                          style={{ width: '100%' }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Major Filter'
                              fullWidth
                              required
                              helperText='Select your major'
                              sx={{ transform: 'scale(0.9)' }}
                            />
                          )}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Autocomplete
                        id='filter-demo'
                        options={religion}
                        getOptionLabel={option => option.title}
                        onChange={(event, newValue) => {
                          setFormData({ ...formData, filter_religion: newValue ? newValue.title : '' })
                        }}
                        style={{ width: '100%' }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Religion Filter'
                            fullWidth
                            required
                            helperText='Select your religion'
                            sx={{ transform: 'scale(0.9)' }}
                          />
                        )}
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
                        <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
                          Lifestyle
                        </Typography>
                      </Box>
                      <Typography variant='body2' sx={{ mt: -2, mb: 2, ml: 14 }}>
                        Please fill in the lifestyle for first-time users.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        id='checkboxes-tags-demo'
                        options={activity}
                        disableCloseOnSelect
                        groupBy={option => option.type}
                        getOptionLabel={option => option.title}
                        onChange={(event, newValue) => {
                          setFormData({ ...formData, activity: newValue.map(option => option.title).join(', ') })
                        }}
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
                        style={{ width: '100%' }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Activity'
                            placeholder='Activity'
                            fullWidth
                            helperText='Select at least 3 activities'
                            sx={{ transform: 'scale(0.9)' }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        id='checkboxes-tags-demo'
                        options={redflag}
                        disableCloseOnSelect
                        groupBy={option => option.type}
                        getOptionLabel={option => option.title}
                        onChange={(event, newValue) => {
                          setFormData({ ...formData, filter_redflag: newValue.map(option => option.title).join(', ') })
                        }}
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
                        style={{ width: '100%' }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Red Flag Filter'
                            placeholder='Favorites'
                            fullWidth
                            helperText='Select your red flags'
                            sx={{ transform: 'scale(0.9)' }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Autocomplete
                        id='filter-demo'
                        options={sleep}
                        getOptionLabel={option => option.title}
                        onChange={(event, newValue) => {
                          setFormData({ ...formData, sleep: newValue ? newValue.title : '' })
                        }}
                        style={{ width: '100%' }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Sleep Style'
                            fullWidth
                            required
                            helperText='Select your sleep style'
                            sx={{ transform: 'scale(0.9)' }}
                          />
                        )}
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
          </Paper>
        </Grid>
      </Grid>
      <DormitoryFooter />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity='success' sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CreatePersonalityUser
