
import { useState, useEffect } from 'react'
import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import TuneIcon from '@mui/icons-material/Tune'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

interface EditTransferRoomProps {
  id: string
}

export default function EditTransferRoom({ id }: EditTransferRoomProps) {
  const [open, setOpen] = React.useState(false)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/dormitoryResident/dormitoryResidentForm/transferForm/read/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setData(result.data) // Ensure the data is set to the 'data' property of the response
      } catch (error) {
        setError(error)
      }
    }

    fetchData()
  }, [id])

  console.log('data', data)
  const handleUpdate = async (status: string) => {
    try {
      const response = await fetch(`/api/admin/dormitoryResident/dormitoryResidentForm/transferForm/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status }) // send the id and status in the request body
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      console.log(result)
      handleClose() // close the dialog after successful update
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>
        <TuneIcon />
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{'Transfer Room Information'}</DialogTitle>
        <DialogContent>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant='h5' component='div'>
                {data?.Username}
              </Typography>
              <Typography variant='body2'>
                Student ID: {data?.StudentID}
                <br />
                Building: {data?.Building}
                <br />
                Room: {data?.Room}
                <br />
                Bed: {data?.Bed}
                <br />
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant='h5' component='div'>
                New Room Information
              </Typography>
              <Typography variant='body2'>
                Building: {data?.newBuilding}
                <br />
                Room: {data?.newRoom}
                <br />
                Bed: {data?.newBed}
                <br />
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleUpdate('reject')}>Disagree</Button>
          <Button onClick={() => handleUpdate('successfully')}>Agree</Button>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
