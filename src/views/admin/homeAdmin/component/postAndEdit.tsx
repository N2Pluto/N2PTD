import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, Avatar, Typography, IconButton, Box, Snackbar, Alert } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DeletePost from './deletePost'
import EditPost from './editPost'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from '@mui/icons-material/Close'

const useStyles = makeStyles({
  success: {
    backgroundColor: '#4caf50'
  },
  error: {
    backgroundColor: '#f44336'
  }
})

const FacebookPostAndEdit: React.FC = () => {
  const classes = useStyles()
  const [post, setPost] = React.useState<any>([])
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/readPost').then(res => res.json())
        setPost(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }, [])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleDeleteSuccess = () => {
    setSnackbarSeverity('success')
    setSnackbarMessage('Post deleted successfully')
    setSnackbarOpen(true)
    // Refresh posts
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/readPost').then(res => res.json())
        setPost(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }

  const handleDeleteError = (message: string) => {
    setSnackbarSeverity('error')
    setSnackbarMessage(`Error deleting post: ${message}`)
    setSnackbarOpen(true)
  }

  return (
    <>
      {post?.map((post: any) => (
        <Card sx={{ maxWidth: 800, marginBottom: 2 }} key={post.id}>
          <CardHeader
            avatar={<Avatar alt='Profile Picture' src='/static/images/avatar/1.jpg' />}
            title='Admin'
            subheader={new Date(post.created_at).toLocaleDateString('en-GB')}
            action={
              <Box>
                <IconButton aria-label='edit'>
                  <EditPost id={post.id} />
                </IconButton>
                <IconButton aria-label='delete'>
                  <DeletePost id={post.id} onDeleteSuccess={handleDeleteSuccess} onDeleteError={handleDeleteError} />
                </IconButton>
              </Box>
            }
          />
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={post.image} alt='' style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <Typography variant='h6' color='text.secondary' sx={{ pt: 2 }}>
              {post.header}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {post.title}
            </Typography>
          </CardContent>
        </Card>
      ))}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={
          <span>
            <ErrorIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {snackbarMessage}
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
    </>
  )
}

export default FacebookPostAndEdit
