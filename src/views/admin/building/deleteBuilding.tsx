import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { TransitionProps } from '@mui/material/transitions'
import { Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import ErrorIcon from '@mui/icons-material/Error'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function DeleteBuilding({ dorm_id, name, handleDeleteBuilding }) {
  const [open, setOpen] = React.useState(false)
  const [confirmationName, setConfirmationName] = React.useState('')
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setConfirmationName('')
  }

  const handleDelete = () => {
    handleDeleteBuilding(dorm_id)
    handleClose()
    setSnackbarOpen(true)
  }

  const handleChange = event => {
    setConfirmationName(event.target.value)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const isDeleteEnabled = confirmationName === `delete-${name}`

  return (
    <React.Fragment>
      <IconButton size='small' color='primary' onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{'Delete Dormitory?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            To confirm deletion please type :
            <Typography component='span' style={{ fontWeight: 'bold' }} sx={{ pl: 2 }}>
              delete-{name}
            </Typography>
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label=''
            type='text'
            fullWidth
            variant='standard'
            value={confirmationName}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDelete} disabled={!isDeleteEnabled}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
