import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Divider from '@mui/material/Divider'

import CloseIcon from '@mui/icons-material/Close'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import RefreshIcon from '@mui/icons-material/Refresh'

interface RoomFilterDrawerProps {
  open: boolean
  onClose: () => void
  bedAvailableFilter: number | null
  setBedAvailableFilter: (value: number | null) => void
  floorFilter: number | null
  setFloorFilter: (value: number | null) => void
}

const RoomFilterDrawer: React.FC<RoomFilterDrawerProps> = ({
  open,
  onClose,
  bedAvailableFilter,
  setBedAvailableFilter,
  floorFilter,
  setFloorFilter
}) => {
  return (
    <Drawer
      anchor='left'
      open={open}
      onClose={onClose}
      ModalProps={{
        BackdropProps: {
          style: {
            backgroundColor: 'transparent' // ตั้งค่าสีพื้นหลังเป็นโปร่งใส
          }
        }
      }}
    >
      <Box sx={{ width: 300,  padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ pb: 2, pt: 5, pr: 2, ml: 4, fontWeight: 'bold' }}>
            Filter Room
          </Typography>
          <IconButton
            color='secondary'
            onClick={() => {
              setBedAvailableFilter(null)
              setFloorFilter(null)
            }}
          >
            <RefreshIcon sx={{ pt: 2, pl: 6, fontSize: '50px' }} />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ pt: 2, fontSize: '35px' }} />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ marginTop: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Floor
            </Typography>
          </Box>
          <Grid container spacing={0} pb={3} pt={1}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={floorFilter === null} onChange={() => setFloorFilter(null)} />}
                label='All'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={floorFilter === 1} onChange={() => setFloorFilter(1)} />}
                label='1st Floor'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={floorFilter === 2} onChange={() => setFloorFilter(2)} />}
                label='2nd Floor'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={floorFilter === 3} onChange={() => setFloorFilter(3)} />}
                label='3rd Floor'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={floorFilter === 4} onChange={() => setFloorFilter(4)} />}
                label='4th Floor'
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Bed Available
            </Typography>
          </Box>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={bedAvailableFilter === null} onChange={() => setBedAvailableFilter(null)} />}
                label='All'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={bedAvailableFilter === 0} onChange={() => setBedAvailableFilter(0)} />}
                label='No Person'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={bedAvailableFilter === 1} onChange={() => setBedAvailableFilter(1)} />}
                label='1 Person'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={bedAvailableFilter === 2} onChange={() => setBedAvailableFilter(2)} />}
                label='2 Person'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={bedAvailableFilter === 3} onChange={() => setBedAvailableFilter(3)} />}
                label='3 Person'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={bedAvailableFilter === 4} onChange={() => setBedAvailableFilter(4)} />}
                label='4 Person'
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant='contained' color='primary' fullWidth onClick={onClose}>
                Apply
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Drawer>
  )
}

export default RoomFilterDrawer
