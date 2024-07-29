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
import Snackbar from '@mui/material/Snackbar'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { makeStyles } from '@mui/styles'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import sendLogsadmincontorl from 'src/pages/api/log/admin/control/insert'
import { userStore } from 'src/stores/userStore'

const useStyles = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  success: {
    backgroundColor: theme.palette.success.dark
  }
}))

export default function SettingRoom({ id, setSnackbarDeleteRoom, room_number ,dormitoryName}: { id: string }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('lg')
  const [dormitoryRoom, setDormitoryRoom] = React.useState<any[]>([])
  const router = useRouter()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const { user } = userStore()



  const loguseredeleteBed = async (name: string) => {
    const content = `Delete Bed in Room Number: '${room_number}' '${name}' `
    await sendLogsadmincontorl(user?.student_id, content, 'Edit Room')
  }

  const loguseredeleteRoom = async (name: string) => {
    const content = `Delete Room Number ${room_number} in '${name}' `
    await sendLogsadmincontorl(user?.student_id, content, 'Edit Room')
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  useEffect(() => {
    const fetchDataBedByRoomID = async () => {
      console.log('id:', id)
      const { data } = await fetch(`/api/bed/room/${id}`).then(res => res.json())
      setDormitoryRoom(data)
    }
    fetchDataBedByRoomID()
  }, [id])

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

  const handleDeleteBed = async (bed_id: string) => {
    try {
      const response = await fetch('/api/admin/delete/bed/deleteBedByID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bed_id })
      })
      loguseredeleteBed(dormitoryName)

      if (!response.ok) {
        throw new Error(`Response is not ok. Status: ${response.status}, Status Text: ${response.statusText}`)
      }
      // Refresh the dormitoryRoom data after successful deletion
      const { data } = await fetch(`/api/bed/room/${id}`).then(res => res.json())
      setDormitoryRoom(data)
      setSnackbarOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteRoom = async (room_id: string) => {
    try {
      const response = await fetch('/api/admin/delete/room/deleteRoomByID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room_id })
      })
      loguseredeleteRoom(dormitoryName)

      if (!response.ok) {
        throw new Error(`Response is not ok. Status: ${response.status}, Status Text: ${response.statusText}`)
      }

      // Refresh the dormitoryRoom data after successful deletion
      const { data } = await fetch(`/api/bed/room/${id}`).then(res => res.json())
      setDormitoryRoom(data)
      handleClose()
      setSnackbarDeleteRoom(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>
        <IoSettingsOutline size={25} />
      </Button>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
        <DialogTitle>Setting Room {room_number}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 5 }}>
            In this section, you have the flexibility to customize the settings for Room {room_number} within the
            dormitory.
          </DialogContentText>
          <Grid container spacing={2}>
            {dormitoryRoom && dormitoryRoom.length > 0 ? (
              dormitoryRoom.map((room, index) => (
                <Grid item xs={12} md={6} lg={6} key={index}>
                  <Card>
                    <CardHeader title={`Bed Number ${room.bed_number}`} />
                    <CardContent>
                      <Typography variant='body2'>Bed ID: {room.bed_id}</Typography>
                      <Typography variant='body2'>Room ID: {room.room_id}</Typography>
                      <Typography variant='body2'>Bed Status: {room.bed_status.toString()}</Typography>
                      <Typography variant='body2'>Bed Number: {room.bed_number}</Typography>
                    </CardContent>
                    <CardActions className='card-action-dense'>
                      <Button onClick={() => handleDeleteBed(room.bed_id)}>Delete Bed</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%'
                }}
              >
                <img
                  src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/bedimg/no_bed_13322224.png'
                  alt='No Data'
                  width='200'
                  height='200'
                  style={{ marginBottom: '10px' }}
                />
                <Typography variant='body1'>Bed Not Found in this Room.</Typography>
              </div>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteRoom(id)}>Delete Room</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={
          <span>
            <ErrorIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {`Delete Bed Successfully!`}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.error }}
      />
    </React.Fragment>
  )
}
