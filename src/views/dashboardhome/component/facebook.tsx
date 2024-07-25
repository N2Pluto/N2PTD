// src/components/FacebookPost.tsx
import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, Avatar, Typography, Box } from '@mui/material'

const FacebookPost: React.FC = () => {
  const [post, setPost] = React.useState<any>([])

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

  console.log(post)

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='100vh' p={2}>
      {post.map((post: any) => (
        <Card
          sx={{
            maxWidth: 650, // typical width of a Facebook post
            width: '100%',
            marginBottom: 6,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            borderRadius: 1
          }}
          key={post.id}
        >
          <CardHeader
            avatar={<Avatar alt='Profile Picture' src='/static/images/avatar/1.jpg' />}
            title='ADMIN'
            subheader={new Date(post.created_at).toLocaleDateString('en-GB')}
          />
          <CardContent>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img src={post.image} alt='' style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </Box>
            <Typography variant='h6' color='text.secondary' sx={{ pt: 2 }}>
              {post.header}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {post.title}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default FacebookPost
