import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { userStore } from 'src/stores/userStore'
import { useRouter } from 'next/router'
import { FormControl, InputLabel } from '@mui/material'

// Define options for the AutoComplete
const editOptions = [
  { label: 'Name (Firstname , Lastname)', fields: ['name', 'lastname'] },
  { label: 'Education (School , Department , Major)', fields: ['school', 'department', 'major'] },
  { label: 'Gender', fields: ['gender'] },
  { label: 'Religion', fields: ['religion'] },
  { label: 'Contact', fields: ['phone'] }
]

// Define hierarchical data for School, Department, and Major
const educationData = {
  'School of Management': {
    departments: {
      'Marketing Management': ['Digital Marketing and Branding'],
      'Logistics Management': ['Logistics Management'],
      'Tourism and Hospitality': ['Hospitality Industry']
    }
  },
  'School of Nursing': {
    departments: {
      'Nursing Science': ['Nursing Science Program']
    }
  },
  'School of Political Science and Public Administration': {
    departments: {
      'Public Administration': ['Public Administration Program'],
      'Political Science': ['Political Science Program']
    }
  },
  'School of Engineering and Technology': {
    departments: {
      'Civil Engineering': ['Civil Engineering Program'],
      'Electrical Engineering': ['Electrical Engineering Program'],
      'Materials Engineer': ['Petrochemical and Polymer Engineering Program'],
      'Mechanical Engineer': ['Mechanical and Robotic Engineering Program'],
      'Chemical Engineer': ['Chemical Engineering and Pharmaceutical Chemistry Program'],
      'Computer Engineer': ['Computer Engineering and Artificial Intelligence Program']
    }
  },
  'School of Architecture and Design': {
    departments: {
      Architecture: ['Architecture Program'],
      'Interior Architecture': ['Interior Design Program']
    }
  },
  'School of Public Health': {
    departments: {
      'Public Health': ['Public Health Program in Community Public Health']
    }
  },
  'School of Medicine': {
    departments: {
      Medicine: ['Medicine Program']
    }
  },
  'School of Science': {
    departments: {
      Mathematics: ['Mathematics Program'],
      Physics: ['Physics Program'],
      Chemistry: ['Chemistry Program'],
      Biology: ['Biology Program']
    }
  },
  'International College of Dentistry': {
    departments: {
      'Dental Surgery': ['Doctor of Dental Surgery Program']
    }
  },
  'Akkhraratchakumari Veterinary College': {
    departments: {
      'Veterinary Science': ['Doctor of Veterinary Medicine Program']
    }
  },
  'School of Accounting and Finance': {
    departments: {
      'Accounting and Finance': [
        'Business Administration (Digital Age Business and Financial Management)',
        'Business Administration Finance and Economics (Digital Age Business and Financial Management Economics)',
        'Accounting Program',
        'Economics'
      ]
    }
  },
  'School of Law': {
    departments: {
      Law: ['Bachelor of Laws']
    }
  },
  'Faculty of Liberal Arts': {
    departments: {
      Education: [
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
      ],
      'Liberal Arts': [
        'Bachelor of Arts Program in Chinese',
        'Bachelor of Arts Program in English',
        'Bachelor of Arts (Thai Language for Communication)'
      ]
    }
  },
  'School of Information Science': {
    departments: {
      'Information Science': [
        'Digital Content and Media',
        'Digital Technology in Medicine',
        'Digital Communication Arts',
        'Intelligent Information Technology',
        'Interactive Multimedia Animation  and Games'
      ]
    }
  },
  'School of Allied Health Sciences': {
    departments: {
      'Physical Therapy': ['Physical Therapy Program'],
      'Medical Technology': ['Medical Technology Program', 'Medical Technology (International)']
    }
  },
  'School of Agricultural Technology and food Industry': {
    departments: {
      'Agricultural Technology': ['Agriculture and Innovation'],
      'Food Industry': ['Food Science and Innovation']
    }
  },
  'School of Pharmacy': {
    departments: {
      Pharmacy: ['Pharmacy Program']
    }
  },
  'International College': {
    departments: {
      'Business Administration (International)': ['Business Administration (International) Program']
    }
  }
}

const UserEditProfile = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { user, clearStore } = userStore()
  const [profileData, setProfileData] = useState(null)
  const [userData, setUserData] = useState({
    student_id: '',
    user_id: ''
  })
  const [userInfoData, setUserInfoData] = useState({
    department: '',
    school: '',
    major: '',
    gender: '',
    lastname: '',
    name: '',
    phone: '',
    religion: '',
    student_year: ''
  })
  const [selectedFields, setSelectedFields] = useState([])
  const [departments, setDepartments] = useState([])
  const [majors, setMajors] = useState([])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/fetchUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id }) // Send user_id to the API
        })
        const data = await response.json()
        setProfileData(data) // Set the received user data
        setUserData(data.userData) // Set userData state
        setUserInfoData(data.userInfoData) // Set userInfoData state
      } catch (error) {
        console.error('Failed to fetch user profile', error)
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])

  const handleClose = () => {
    router.push('/userGoogleForm/editCard/')
  }

  const handleSchoolChange = e => {
    const selectedSchool = e.target.value
    setUserInfoData({ ...userInfoData, school: selectedSchool, department: '', major: '' })
    setDepartments(Object.keys(educationData[selectedSchool].departments))
    setMajors([])
  }

  const handleDepartmentChange = e => {
    const selectedDepartment = e.target.value
    setUserInfoData({ ...userInfoData, department: selectedDepartment, major: '' })
    setMajors(educationData[userInfoData.school].departments[selectedDepartment])
  }

  const handleSubmit = async () => {
    const formData = {}
    selectedFields.forEach(fieldGroup => {
      fieldGroup.fields.forEach(field => {
        formData[field] = userInfoData[field]
      })
    })

    try {
      const response = await fetch('/api/userForm/editProfile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formData, user_id: user.user_id }) // Include user_id in the payload
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const data = await response.json()
      console.log('Form submitted successfully:', data)
      handleClose() // Call handleClose on successful submission
    } catch (error) {
      console.error('Failed to submit form', error)
      handleClose() // Optionally, call handleClose even on error if you want to close the form/dialog
    }
  }

  return (
    <Card>
      <CardHeader title='Edit Profile Form' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Current Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='First Name' name='first_name' value={userInfoData.name} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Last Name' name='last_name' value={userInfoData.lastname} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Student ID' name='student_id' value={userData.student_id} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Gender' name='gender' value={userInfoData.gender} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Religion' name='religion' value={userInfoData.religion} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Phone' name='phone' value={userInfoData.phone} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='School' name='school' value={userInfoData.school} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Department' name='department' value={userInfoData.department} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Major' name='major' value={userInfoData.major} disabled />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. New Dormitory Assignment
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={editOptions}
                disableCloseOnSelect
                getOptionLabel={option => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                    {option.label}
                  </li>
                )}
                style={{ width: '100%' }}
                renderInput={params => <TextField {...params} label='Select Fields to Edit' placeholder='Fields' />}
                onChange={(event, value) => setSelectedFields(value)}
              />
            </Grid>
            {selectedFields.map(fieldGroup =>
              fieldGroup.fields.map(field => (
                <Grid item xs={12} sm={6} key={field}>
                  {field === 'religion' ? (
                    <FormControl fullWidth>
                      <InputLabel id='religion-label'>Religion</InputLabel>
                      <Select
                        labelId='religion-label'
                        name='religion'
                        value={userInfoData.religion}
                        onChange={e => setUserInfoData({ ...userInfoData, religion: e.target.value })}
                        label='Religion'
                      >
                        <MenuItem value='Buddhism'>Buddhism</MenuItem>
                        <MenuItem value='Christianity'>Christianity</MenuItem>
                        <MenuItem value='Islam'>Islam</MenuItem>
                        <MenuItem value='Hinduism'>Hinduism</MenuItem>
                        <MenuItem value='Other'>Other</MenuItem>
                      </Select>
                    </FormControl>
                  ) : field === 'gender' ? (
                    <FormControl fullWidth>
                      <InputLabel id='gender-label'>Gender</InputLabel>
                      <Select
                        fullWidth
                        label='Gender'
                        name='gender'
                        value={userInfoData.gender}
                        onChange={e => setUserInfoData({ ...userInfoData, gender: e.target.value })}
                      >
                        <MenuItem value='male'>male</MenuItem>
                        <MenuItem value='female'>female</MenuItem>
                      </Select>
                    </FormControl>
                  ) : field === 'school' ? (
                    <FormControl fullWidth>
                      <InputLabel id='school-label'>School</InputLabel>
                      <Select
                        fullWidth
                        label='School'
                        name='school'
                        value={userInfoData.school}
                        onChange={handleSchoolChange}
                      >
                        {Object.keys(educationData).map(school => (
                          <MenuItem key={school} value={school}>
                            {school}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : field === 'department' ? (
                    <FormControl fullWidth>
                      <InputLabel id='department-label'>Department</InputLabel>
                      <Select
                        fullWidth
                        label='Department'
                        name='department'
                        value={userInfoData.department}
                        onChange={handleDepartmentChange}
                        disabled={!userInfoData.school}
                      >
                        {departments.map(department => (
                          <MenuItem key={department} value={department}>
                            {department}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : field === 'major' ? (
                    <FormControl fullWidth>
                      <InputLabel id='major-label'>Major</InputLabel>
                      <Select
                        fullWidth
                        label='Major'
                        name='major'
                        value={userInfoData.major}
                        onChange={e => setUserInfoData({ ...userInfoData, major: e.target.value })}
                        disabled={!userInfoData.department}
                      >
                        {majors.map(major => (
                          <MenuItem key={major} value={major}>
                            {major}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      value={userInfoData[field]}
                      onChange={e => setUserInfoData({ ...userInfoData, [field]: e.target.value })}
                    />
                  )}
                </Grid>
              ))
            )}
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button size='large' color='secondary' variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button size='large' sx={{ mr: 2 }} variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default UserEditProfile
