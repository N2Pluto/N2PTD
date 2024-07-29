import * as React from 'react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import { IoSettingsOutline } from 'react-icons/io5'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { userStore } from 'src/stores/userStore'

// ** Icons Imports
import Phone from 'mdi-material-ui/Phone'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import { MdMeetingRoom } from 'react-icons/md'
import { FaBed } from 'react-icons/fa6'
import sendLogsadmincontorl from 'src/pages/api/log/admin/control/insert'

export default function CreateRoom({ setSnackbarOpen, dormitoryName }) {
  const [open, setOpen] = React.useState(false)
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
  const [room_number, setRoomNumber] = React.useState('')
  const [bed_capacity, setBedCapacity] = React.useState('')
  const { user } = userStore()

  const router = useRouter()

  const dorm_id = router.query.id
  console.log('dormname:', dormitoryName)

  const loguseredit = async (name: string) => {
    const content = `Add Room Number: '${room_number}' Bedcapacity: '${bed_capacity}' in '${name}' `
    await sendLogsadmincontorl(user?.student_id, content, 'Edit Room')
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/admin/create/room/createRoomByID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dorm_id,
          room_number: room_number,
          bed_capacity: bed_capacity
        })
      })
      loguseredit(dormitoryName)

      if (!response.ok) {
        throw new Error(`Response is not ok. Status: ${response.status}, Status Text: ${response.statusText}`)
      }

      const data = await response.json()

      // Call createBedByID after successfully creating the room
      const bedResponse = await fetch('/api/admin/create/room/createBedByID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dorm_id, // Pass dorm_id instead of room_id
          bed_capacity: bed_capacity
        })
      })

      if (!bedResponse.ok) {
        throw new Error('Failed to create beds')
      }

      handleClose()
      setSnackbarOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
    setMaxWidth(event.target.value)
  }

  const handleFullWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullWidth(event.target.checked)
  }

  return (
    <React.Fragment>
      <Button variant='contained' color='primary' onClick={handleClickOpen}>
        Create Room
      </Button>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
        <DialogTitle>Create Room in {dormitoryName}</DialogTitle> {/* Display dormitory name */}
        <DialogContent>
          <Card>
            <CardHeader title='Input a detail to create a room.' titleTypographyProps={{ variant: 'h2' }} />
            <CardContent>
              <form onSubmit={e => e.preventDefault()}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type='number'
                      label='Room Number'
                      placeholder='Room Number'
                      value={room_number}
                      onChange={e => setRoomNumber(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <MdMeetingRoom />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type='number'
                      label='Bed Capacity'
                      placeholder='Bed Capacity'
                      value={bed_capacity}
                      onChange={e => setBedCapacity(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <FaBed />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
