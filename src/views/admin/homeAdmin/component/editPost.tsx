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
import router from 'next/router'
import EditIcon from '@mui/icons-material/Edit'
import { Grid, TextField } from '@mui/material'
import { useEffect } from 'react'

interface FormData {
  header?: any
  title?: any
}

export default function EditPost({ id }: { id: any }) {
  const [formData, setFormData] = React.useState<FormData>({})
  const [postData, setPostData] = React.useState([])

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`/api/admin/read/post/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (data.postData) {
          setPostData(data.postData)
          console.log('data', data)
        } else {
          console.log('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching post data:', error)
      }
    }

    fetchPostData()
  }, [id]) // add id as a dependency if it can change over time

  console.log('post', postData)

  const handleEditPost = async (id: any) => {
    try {
      const response = await fetch(`/api/admin/edit/updatePost`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, ...formData })
      })
      const data = await response.json()

      console.log('response',response)
      if (response.ok) {
        alert('Post updated successfully')
        router.reload()
      }
      console.log(data)
    } catch (error) {
      console.error('Error updating post data:', error)
    }
  }

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target

    if (name === 'name') {
      setFormData({ ...formData, [name]: value })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleEdit = () => {
    handleEditPost(id)

    handleClose()
  }

  return (
    <React.Fragment>
      <EditIcon onClick={handleClickOpen} />
      <Dialog
        open={open}
        TransitionComponent={Slide}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
        maxWidth='lg' // set maxWidth to 'lg' to make the dialog box larger
        fullWidth // set fullWidth to true to make the dialog take up the full width of the screen
      >
        <DialogTitle>{'Edit Post?'}</DialogTitle>
        <DialogContent>
          <Grid item xs={12} sm={12} sx={{ pb: 3, pt: 3 }}>
            <TextField
              fullWidth
              label=''
              placeholder='header'
              name='header'
              value={formData.header || postData.header}
              onChange={handleInputChange}
              size='medium' // set size to 'medium' to make the TextField larger
              variant='outlined' // set variant to 'outlined' to make the TextField appear larger
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label=''
              placeholder='title'
              name='title'
              value={formData.title || postData.title}
              onChange={handleInputChange}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleEdit}>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
