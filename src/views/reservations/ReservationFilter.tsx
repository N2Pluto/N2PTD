import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import { ChevronDown, ChevronUp } from 'mdi-material-ui'
import { Collapse, Divider } from '@mui/material'

const ReservationFilter = () => {
  // ** State
  const [collapse, setCollapse] = useState<boolean>(false)

  const handleClick = () => {
    setCollapse(!collapse)
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Button onClick={handleClick}>Filter</Button>

          </Box>
          <Collapse in={collapse}>
            <Divider sx={{ margin: 0 }} />
            <CardContent>
              <Button>1</Button>
              <Button>2</Button>
              <Button>3</Button>

            </CardContent>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ReservationFilter
