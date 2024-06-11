import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useEffect, useState } from 'react'
import React from 'react'
import { SiGoogleforms } from 'react-icons/si'
import Chip from '@mui/material/Chip'

interface GoogleFormData {
  id: number
  form_name: string
  form_url: string
  start_date: string
  end_date: string
  status: boolean
}

const UserGoogleFormCard = () => {
  const [rows, setRows] = useState<GoogleFormData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/userGoogleForm/read/')
        const result = await response.json()
        setRows(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
      {rows.map(row => (
        <Card key={row.id} sx={{ width: 300, boxShadow: 3, borderRadius: 2 }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: 3,
              position: 'relative'
            }}
          >
            <Avatar
              sx={{ width: 50, height: 50, marginBottom: 2, color: 'common.white', backgroundColor: 'primary.main' }}
            >
              <SiGoogleforms size={30} />
            </Avatar>

            <Typography variant='h6' sx={{ marginBottom: 2 }}>
              {row.form_name}
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 2, color: 'text.secondary' }}>
              Start Date: {new Date(row.start_date).toLocaleDateString()}
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 2, color: 'text.secondary' }}>
              End Date: {new Date(row.end_date).toLocaleDateString()}
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 2 }}>
              <Chip label={row.status ? 'Active' : 'Inactive'} color={row.status ? 'success' : 'error'} />
            </Typography>
            <Button
              variant='contained'
              sx={{
                padding: theme => theme.spacing(1.5, 4),
                marginTop: 2,
                backgroundColor: row.status === false ? 'grey' : undefined, // Set button color to grey when disabled
                '&:disabled': {
                  backgroundColor: 'lightgrey', // Ensure the button remains grey when disabled
                  color: 'white' // Optional: Adjust text color for disabled state
                }
              }}
              onClick={() => window.open(row.form_url, '_blank')}
              disabled={!row.status} // Disable button when row.status is false
            >
              Open Form
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default UserGoogleFormCard
