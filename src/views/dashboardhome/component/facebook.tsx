// src/components/FacebookPost.tsx
import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, Avatar, Typography, Box } from '@mui/material'
import { styled } from '@mui/system'

const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  }
}))

const FacebookPost: React.FC = () => {
  const [post, setPost] = React.useState<any>([])

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/readPost').then(res => res.json())
        if (isMounted) {
          setPost(data)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching dormitory building data:', error)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='100vh' p={2}>
      {post.map((post: any) => (
        <AnimatedCard
          sx={{
            maxWidth: 700, // typical width of a Facebook post
            width: '100%',
            marginBottom: 6,
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
                height: '700px',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img src={post.image} alt='' style={{ width: 'auto', height: '100%', objectFit: 'initial' }} />
            </Box>

            <Typography variant='h6' color='text.secondary' sx={{ pt: 2 }}>
              {post.header}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {post.title}
            </Typography>
          </CardContent>
        </AnimatedCard>
      ))}
    </Box>
  )
}

export default FacebookPost
