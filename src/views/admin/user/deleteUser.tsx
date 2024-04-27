import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import DeleteIcon from '@mui/icons-material/Delete'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

interface DeleteUserProps {
  selected: readonly number[]
  resetSelected: () => void
}


export default function DeleteUser(props: DeleteUserProps) {
  const { selected, resetSelected } = props
  const [open, setOpen] = React.useState(false)
  console.log('selected button', selected)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/admin/user/delete/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: selected })
      })

      if (!response.ok) {
        throw new Error('Error deleting user')
      }

      // Close the dialog
      handleClose()
      resetSelected()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>
        <DeleteIcon />
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{'Delete this user?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>Do you want to delete this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDelete}>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
