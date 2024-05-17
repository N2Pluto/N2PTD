// src/components/FacebookPost.tsx
import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, Avatar, Typography } from '@mui/material'

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
    <>
      {post.map((post: any) => (
        <Card sx={{ maxWidth: 1000, marginBottom: 6 }} key={post.id}>
        <CardHeader
          avatar={<Avatar alt='Profile Picture' src='/static/images/avatar/1.jpg' />}
          title='ADMIN'
          subheader={new Date(post.created_at).toLocaleDateString('en-GB')}
        />
        <CardContent>
          <img src={post.image} alt='' style={{ maxWidth: '100%', height: 'auto' }} />
          <Typography variant='h6' color='text.secondary' sx={{pt:2}}>
            {post.header}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {post.title}
          </Typography>
        </CardContent>
      </Card>
      ))}
    </>
  )
}

export default FacebookPost
