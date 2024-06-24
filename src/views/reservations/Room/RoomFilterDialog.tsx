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
  disableScrollLock?: boolean
  bedAvailableFilter: number | null
  setBedAvailableFilter: (value: number | null) => void
  floorFilter: number | null
  setFloorFilter: (value: number | null) => void
  schoolFilter: number | null
  setSchoolFilter: (value: number | null) => void
  majorFilter: number | null
  setMajorFilter: (value: number | null) => void
  religionFilter: number | null
  setReligionFilter: (value: number | null) => void
  sleepFilter: number | null
  setSleepFilter: (value: number | null) => void
}

const RoomFilterDrawer: React.FC<RoomFilterDrawerProps> = ({
  open,
  onClose,
  disableScrollLock = false,
  bedAvailableFilter,
  setBedAvailableFilter,
  floorFilter,
  setFloorFilter,
  schoolFilter,
  setSchoolFilter,
  majorFilter,
  setMajorFilter,
  religionFilter,
  setReligionFilter,
  sleepFilter,
  setSleepFilter
}) => {
  return (
    <Drawer
      anchor='left'
      open={open}
      disableScrollLock={disableScrollLock}
      onClose={onClose}
      ModalProps={{
        BackdropProps: {
          style: {
            backgroundColor: 'transparent' // ตั้งค่าสีพื้นหลังเป็นโปร่งใส
          }
        }
      }}
    >
      <Box sx={{ width: 250, padding: 2 }}>
        <Grid container alignItems='center'>
          <Grid item xs={8}>
            <Typography variant='body1' sx={{ pb: 2, pt: 5, pr: 2, ml: 4, fontWeight: 'bold' }}>
              Filter Room
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'right', mt: 2 }}>
            <IconButton
              color='secondary'
              onClick={() => {
                setBedAvailableFilter(null)
                setFloorFilter(null)
                setSchoolFilter(null)
                setMajorFilter(null)
                setReligionFilter(null)
                setSleepFilter(null)
              }}
            >
              <RefreshIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'right', mt: 2 }}>
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <Box sx={{ marginTop: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='body1' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Floor
            </Typography>
          </Box>
          <Grid container spacing={0} pb={3} pt={1}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={floorFilter === null} onChange={() => setFloorFilter(null)} size='small' />}
                label={<Typography variant='body2'>All</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={floorFilter === 1} onChange={() => setFloorFilter(1)} size='small' />}
                label={<Typography variant='body2'>1st Floor</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={floorFilter === 2} onChange={() => setFloorFilter(2)} size='small' />}
                label={<Typography variant='body2'>2nd Floor</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={floorFilter === 3} onChange={() => setFloorFilter(3)} size='small' />}
                label={<Typography variant='body2'>3rd Floor</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={floorFilter === 4} onChange={() => setFloorFilter(4)} size='small' />}
                label={<Typography variant='body2'>4th Floor</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='body1' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Bed Available
            </Typography>
          </Box>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio
                    checked={bedAvailableFilter === null}
                    onChange={() => setBedAvailableFilter(null)}
                    size='small'
                  />
                }
                label={<Typography variant='body2'>All</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio checked={bedAvailableFilter === 0} onChange={() => setBedAvailableFilter(0)} size='small' />
                }
                label={<Typography variant='body2'>No Person</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio checked={bedAvailableFilter === 1} onChange={() => setBedAvailableFilter(1)} size='small' />
                }
                label={<Typography variant='body2'>1 Person</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio checked={bedAvailableFilter === 2} onChange={() => setBedAvailableFilter(2)} size='small' />
                }
                label={<Typography variant='body2'>2 Person</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio checked={bedAvailableFilter === 3} onChange={() => setBedAvailableFilter(3)} size='small' />
                }
                label={<Typography variant='body2'>3 Person</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio checked={bedAvailableFilter === 4} onChange={() => setBedAvailableFilter(4)} size='small' />
                }
                label={<Typography variant='body2'>4 Person</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='body1' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              School
            </Typography>
          </Box>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={schoolFilter === null} onChange={() => setSchoolFilter(null)} size='small' />}
                label={<Typography variant='body2'>All</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={schoolFilter === 0} onChange={() => setSchoolFilter(0)} size='small' />}
                label={<Typography variant='body2'>Same School</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={schoolFilter === 1} onChange={() => setSchoolFilter(1)} size='small' />}
                label={<Typography variant='body2'>Different School</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='body1' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Major
            </Typography>
          </Box>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={majorFilter === null} onChange={() => setMajorFilter(null)} size='small' />}
                label={<Typography variant='body2'>All</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={majorFilter === 0} onChange={() => setMajorFilter(0)} size='small' />}
                label={<Typography variant='body2'>Same Major</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={majorFilter === 1} onChange={() => setMajorFilter(1)} size='small' />}
                label={<Typography variant='body2'>Different Major</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='body1' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Religion
            </Typography>
          </Box>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio checked={religionFilter === null} onChange={() => setReligionFilter(null)} size='small' />
                }
                label={<Typography variant='body2'>All</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={religionFilter === 0} onChange={() => setReligionFilter(0)} size='small' />}
                label={<Typography variant='body2'>Same Religion</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={religionFilter === 1} onChange={() => setReligionFilter(1)} size='small' />}
                label={<Typography variant='body2'>Different Religion</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='body1' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Sleep Style
            </Typography>
          </Box>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={sleepFilter === null} onChange={() => setSleepFilter(null)} size='small' />}
                label={<Typography variant='body2'>All</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={sleepFilter === 0} onChange={() => setSleepFilter(0)} size='small' />}
                label={<Typography variant='body2'>Same Sleep Style</Typography>}
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={sleepFilter === 1} onChange={() => setSleepFilter(1)} size='small' />}
                label={<Typography variant='body2'>Different Sleep Style</Typography>}
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
