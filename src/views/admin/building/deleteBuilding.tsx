import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { sendDiscordMessage } from 'src/pages/api/discord/admin/deleteBuilding'
import { userStore } from 'src/stores/userStore'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function DeleteBuilding({ dorm_id ,name,handleDeleteBuilding }) {
  const [open, setOpen] = React.useState(false)
  const { user } = userStore()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const discordHandle = async (id: number, email: string, name: string) => {
    await sendDiscordMessage(
      id,
      email,
      `Delete building\nDelete all buildings, rooms, and beds of  Dormitory Building : ${name}`
    )
  }

  const handleDelete = () => {
    handleDeleteBuilding(dorm_id)
    discordHandle(user.student_id, user.email,name)
    handleClose()
  }

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>Delete</Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{'Delete Dormitory?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>You Want to Delete this Dormitory?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDelete}>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
