import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import EditIcon from '@mui/icons-material/Edit'
import Typography from '@mui/material/Typography'

interface TransferRoomProps {
  open: boolean
  onClose: () => void
  id: string
}

export default function TransferRoom({ open, onClose, id }: TransferRoomProps) {
  const handleClose = () => {
    onClose()
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const formJson = Object.fromEntries((formData as any).entries())
    const email = formJson.email

    // Call the API to transfer the resident
    const response = await fetch('/api/admin/dormitoryResident/update/transferResident', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id1: id, // The current resident's ID
        id2: email // The ID of the resident to swap with
      })
    })

    const data = await response.json()

    if (data.error) {
      console.error(data.error)
    } else {
      console.log('Transfer successful')
    }

    handleClose()
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries((formData as any).entries())
            const email = formJson.email
            handleClose()
          }
        }}
      >
        <DialogTitle>ทำการแลกเปลี่ยนห้อง</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates occasionally.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button type='submit'>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
