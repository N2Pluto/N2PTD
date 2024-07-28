import { ChangeEvent, useState, useCallback, ElementType } from 'react'
import { useDropzone } from 'react-dropzone'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button, { ButtonProps } from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import router from 'next/router'
import supabase from 'src/libs/supabase'
import { styled } from '@mui/material/styles'
import { Backdrop, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { makeStyles } from '@mui/styles'
import ErrorIcon from '@mui/icons-material/Error'
import IconButton from '@mui/material/IconButton'

const useStyles = makeStyles({
  success: {
    backgroundColor: '#4caf50'
  },
  error: {
    backgroundColor: '#f44336'
  }
})

const FormLayoutsFacebookPost = () => {
  const classes = useStyles()
  const [header, setHeader] = useState('')
  const [title, setTitle] = useState('')
  const [profileData, setProfileData] = useState(null)
  const [imgSrc, setImgSrc] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    image: profileData?.userInfoData.image
  })

  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const ImgStyled = styled('img')(({ theme }) => ({
    width: 800,
    height: 500,
    borderRadius: theme.shape.borderRadius
  }))

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/create/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          header: header,
          title: title,
          image: formData.image
        })
      })

      console.log('response', response)

      if (response.ok) {
        setSnackbarSeverity('success')
        setSnackbarMessage('สร้างโพสต์สำเร็จ')
        setSnackbarOpen(true)
        setTimeout(() => {
          setLoading(false)
          router.push('/admin/home')
        }, 3000) // Delay navigation by 3 seconds
      } else {
        setSnackbarSeverity('error')
        setSnackbarMessage('สร้างโพสต์ไม่สำเร็จ')
        setSnackbarOpen(true)
        setLoading(false)
      }
    } catch (error) {
      setSnackbarSeverity('error')
      setSnackbarMessage('An error occurred: ' + error.message)
      setSnackbarOpen(true)
      setLoading(false)
    }
  }

  const onDrop = useCallback(async acceptedFiles => {
    const file = acceptedFiles[0]
    const reader = new FileReader()

    if (file) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(file)

      // Generate a new filename with the current timestamp
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '')
      const extension = file.name.split('.').pop()
      const newFileName = `${timestamp}.${extension}`

      // Upload file to Supabase with the new filename
      const filePath = `public/${newFileName}`
      const { error } = await supabase.storage.from('post').upload(filePath, file)

      if (error) {
        console.error('Error uploading image: ', error.message)
      } else {
        console.log('Image uploaded successfully')
        const { data, error: urlError } = await supabase.storage.from('post').getPublicUrl(filePath)

        if (urlError) {
          console.error('Error getting public URL: ', urlError.message)
        } else {
          const { publicUrl } = data
          setFormData(prevState => ({ ...prevState, image: publicUrl }))
          console.log('Image URL:', publicUrl)
        }
      }
    }
  }, [])

  const handleChange = () => {
    setImgSrc('')
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/png, image/jpeg' })

  return (
    <Card>
      <CardHeader title='Basic' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleFormSubmit}>
          {imgSrc && (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' sx={{ pb: 4 }} />

              <Button onClick={handleChange} variant='contained' size='large'>
                Delete photo
              </Button>
            </Box>
          )}
          {!imgSrc && (
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #1877F2',
                borderRadius: '4px',
                padding: '20px',
                marginTop: 3,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#F0F2F5',
                color: '#1C1E21',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }}
            >
              <input {...getInputProps()} />
              <p>Drag & drop an image here, or click to select one</p>
            </Box>
          )}

          <Grid container spacing={5} sx={{ marginTop: 3 }}>
            <Grid item xs={12}>
              <TextField fullWidth label='Header' placeholder='' onChange={event => setHeader(event.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Title' placeholder='' onChange={event => setTitle(event.target.value)} />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box></Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button type='submit' variant='contained' size='large'>
                    Get Post!
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {snackbarMessage}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.success }}
      />

      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default FormLayoutsFacebookPost
