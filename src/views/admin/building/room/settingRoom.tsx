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


export default function SettingRoom({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false)
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('lg')
  const [dormitoryRoom, setDormitoryRoom] = React.useState<any[]>([])
  const router = useRouter()

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

      if (!response.ok) {
        throw new Error(`Response is not ok. Status: ${response.status}, Status Text: ${response.statusText}`)
      }
      // Refresh the dormitoryRoom data after successful deletion
      const { data } = await fetch(`/api/bed/room/${id}`).then(res => res.json())
      setDormitoryRoom(data)
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

       if (!response.ok) {
         throw new Error(`Response is not ok. Status: ${response.status}, Status Text: ${response.statusText}`)
       }

       // Refresh the dormitoryRoom data after successful deletion
       const { data } = await fetch(`/api/bed/room/${id}`).then(res => res.json())
       setDormitoryRoom(data)
       handleClose()
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
        <DialogTitle>Setting Room</DialogTitle>
        <DialogContent>
          <DialogContentText>You can set my maximum width and whether to adapt or not.</DialogContentText>
          <Grid container spacing={2}>
            {dormitoryRoom &&
              dormitoryRoom.map((room, index) => (
                <Grid item xs={12} md={6} lg={6} key={index}>
                  <Card>
                    <CardHeader title={`Bed Number ${room.bed_number}`} />
                    <CardContent>
                      <Typography variant='body2' sx={{ marginBottom: 3.25 }}>
                        Bed ID: {room.bed_id}
                      </Typography>
                      <Typography variant='body2'>Room ID: {room.room_id}</Typography>
                      <Typography variant='body2'>Bed Status: {room.bed_status.toString()}</Typography>
                      <Typography variant='body2'>Bed Number: {room.bed_number}</Typography>
                    </CardContent>
                    <CardActions className='card-action-dense'>
                      <Button onClick={() => handleDeleteBed(room.bed_id)}>Delete Bed</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteRoom(id)}>Delete Room</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
