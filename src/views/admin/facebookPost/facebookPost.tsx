// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import router from 'next/router'

const FormLayoutsFacebookPost = () => {
  const [data, setData] = useState('')

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/admin/create/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          href: data
        })
      })

      if (response.ok) {
        alert('Data has been successfully submitted!')
        router.reload()

      } else {
        alert('There was a problem with the submission.')
        router.reload()
      }
    } catch (error) {
      alert('An error occurred: ' + error.message)
    }
  }

  return (
    <Card>
      <CardHeader title='Basic' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='link'
                placeholder=''
                onChange={event => setData(event.target.value)}
              />
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
                <Box>
                  ใส่ลิ้งค์โพสต์ ที่ต้องการแชร์ ของคุณ
                </Box>
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
