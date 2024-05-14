import React, { useState } from 'react'
import FacebookPost from './facebook'
import Grid from '@mui/material/Grid'

const PostCard: React.FC = () => {



  return (
    <>
      <Grid pb={4} className='size-1'>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 3 ,pl:5 }}>
          <FacebookPost />
        </Grid>
      </Grid>
    </>
  )
}

export default PostCard
