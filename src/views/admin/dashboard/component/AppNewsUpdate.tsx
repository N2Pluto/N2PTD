import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ----------------------------------------------------------------------

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 5 }}>
        

        <Typography variant='body2' sx={{ color: 'text.secondary', pb: 2 }}>
          Get updated on what's happening around you.
        </Typography>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size='small' color='inherit'>
          View all
        </Button>
      </Box>
    </Card>
  )
}

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired
}

// ----------------------------------------------------------------------

function NewsItem({ news }) {
  const { image, title, description, postedAt } = news

  return (
    <Stack direction='row' alignItems='center' spacing={2}>
      <Box component='img' alt={title} src={image} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />

      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color='inherit' variant='subtitle2' underline='hover' noWrap>
          {title}
        </Link>

        <Typography variant='body2' sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
      </Box>

      <Typography variant='caption' sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(postedAt)}
      </Typography>
    </Stack>
  )
}

