import React, { useState } from 'react';
import { Avatar, Card, CardContent, CardHeader, IconButton, Typography, Dialog, DialogContent } from '@mui/material';
import { FavoriteBorder as LikeIcon, ChatBubbleOutline as CommentIcon, Share as ShareIcon } from '@mui/icons-material';
import { Image } from 'mdi-material-ui';

const PostCard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleClickOpen = (img: string) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const imageUrl = 'https://www.skillshare.com/blog/wp-content/uploads/2023/11/skillshare-class-pixel-perfect-mastering-pixel-art-101.jpg';

  return (
    <>
      <Card sx={{ maxWidth: 1000, marginBottom: 2 }}>
        <CardHeader
          avatar={
            <Avatar
              alt='User Name'
              src='https://www.skillshare.com/blog/wp-content/uploads/2023/11/skillshare-class-pixel-perfect-mastering-pixel-art-101.jpg'
            />
          }
          action={<IconButton aria-label='settings'>{/* Replace with more options icon */}</IconButton>}
          title='User Name'
          subheader='September 14, 2021'
        />
        <CardContent>
          <img
            src={imageUrl}
            alt={'Facebook Post'}
            loading='lazy'
            width={700}
            height={700}
            style={{ cursor: 'pointer' }}
            onClick={() => handleClickOpen(imageUrl)}
          />
          <Typography sx={{ pt: 2, pl: 1 }} variant='body2' color='text.secondary'>
            This is a sample Facebook post!
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt=""
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostCard;
