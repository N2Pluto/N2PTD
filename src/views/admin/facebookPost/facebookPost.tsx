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
import router from 'next/router'
import supabase from 'src/libs/supabase'
import { styled } from '@mui/material/styles'
import { Backdrop, CircularProgress } from '@mui/material'

const FormLayoutsFacebookPost = () => {
  const [header, setHeader] = useState('')
  const [title, setTitle] = useState('')
  const [profileData, setProfileData] = useState(null)
  const [imgSrc, setImgSrc] = useState<string>('')
  const [open, setOpen] = useState(false)

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

      console.log('response',response)

      if (response.ok) {
        alert ('สร้างโพสต์สำเร็จ')
        router.push('/admin/home')
      }else{
        alert ('สร้างโพสต์ไม่สำเร็จ')
      }


    } catch (error) {
      alert('An error occurred: ' + error.message)
    }
  }

  const onDrop = useCallback(async acceptedFiles => {
    const file = acceptedFiles[0]
    const reader = new FileReader()

    if (file) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(file)

      // Upload file to Supabase
      const filePath = `public/${file.name}`
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

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/png, image/jpeg' })

  return (
    <Card>
      <CardHeader title='Basic' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleFormSubmit}>
          {imgSrc && (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <ImgStyled src={imgSrc} alt='Profile Pic' sx={{pb:4}}/>

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
    </Card>
  )
}

export default FormLayoutsFacebookPost
