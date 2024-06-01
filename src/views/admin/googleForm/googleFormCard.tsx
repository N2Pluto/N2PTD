import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useEffect, useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'
import { SiGoogleforms } from 'react-icons/si'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import GoogleFormEdit from './googleFormEdit'
import Chip from '@mui/material/Chip'
import EditIcon from '@mui/icons-material/Edit'

// ** Icons Imports
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

interface GoogleFormData {
  id: number
  form_name: string
  form_url: string
  start_date: string
  end_date: string
  status: boolean
}

const GoogleFormCard = () => {
  const [rows, setRows] = useState<GoogleFormData[]>([])
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const open = Boolean(anchorEl)
  const [formEditKey, setFormEditKey] = useState(0)
  const [currentId, setCurrentId] = useState<number | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setCurrentId(id)
    setAnchorEl(event.currentTarget)
    console.log('currentId', currentId)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = (id: number) => {
    setSelectedFormId(currentId)
    setDrawerOpen(true)
    handleClose()
    setFormEditKey(prevKey => prevKey + 1)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/googleForm/read/')
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
            <Button
              id='basic-button'
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={event => handleClick(event, row.id)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                minWidth: 'auto',
                padding: 0,
                color: 'text.secondary'
              }}
            >
              <MoreVertIcon />
            </Button>
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
            >
              <MenuItem onClick={handleEdit}>
                <EditIcon />
                <span style={{ marginLeft: '8px' }}>Edit Form</span>
              </MenuItem>
            </Menu>
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
              sx={{ padding: theme => theme.spacing(1.5, 4), marginTop: 2 }}
              onClick={() => window.open(row.form_url, '_blank')}
            >
              Open Form
            </Button>
          </CardContent>
        </Card>
      ))}
      <GoogleFormEdit key={formEditKey} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} id={selectedFormId} />
    </div>
  )
}

export default GoogleFormCard
