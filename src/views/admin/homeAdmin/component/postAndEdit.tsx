// src/components/FacebookPost.tsx
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, Avatar, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeletePost from './deletePost';
import EditPost from './editPost';

const FacebookPostAndEdit: React.FC = () => {
  const [post, setPost] = React.useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/readPost').then(res => res.json());
        setPost(data);
      } catch (error) {
        console.error('Error fetching dormitory building data:', error);
      }
    };

    fetchData();
  }, []);

  console.log(post);




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
                <IconButton aria-label="edit">
                <EditPost id={post.id} />
                </IconButton>
                <IconButton aria-label="delete" >

                  <DeletePost id={post.id} />
                </IconButton>
              </Box>
            }
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
  );
};

export default FacebookPostAndEdit;
