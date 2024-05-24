// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import router from 'next/router'


const NewPost = () => {

const headlelink = () =>{
  router.push('/admin/facebookPost')
}


  return (
    <Card>
      <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          News Post
        </Typography>
        <Typography variant='body2'>

        </Typography>
      </CardContent>
      <Button variant='contained' sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} onClick={headlelink}>
        new post
      </Button>

    </Card>
  )
}

export default NewPost
