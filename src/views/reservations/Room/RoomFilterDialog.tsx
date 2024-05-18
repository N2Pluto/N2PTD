// RoomFilterDialog.tsx
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
  Grid,
  Button
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'

interface RoomFilterDialogProps {
  open: boolean
  onClose: () => void
  bedAvailableFilter: number | null
  setBedAvailableFilter: (value: number | null) => void
  floorFilter: number | null
  setFloorFilter: (value: number | null) => void
}

const RoomFilterDialog: React.FC<RoomFilterDialogProps> = ({
  open,
  onClose,
  bedAvailableFilter,
  setBedAvailableFilter,
  floorFilter,
  setFloorFilter
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Filter Room</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex' }}>
          <HolidayVillageIcon fontSize='small' sx={{ marginRight: 2 }} />
          <Typography sx={{ paddingRight: 2 }}>Floor</Typography>
        </Box>
        <Grid container spacing={2} pb={5} pt={1}>
          <FormControlLabel
            control={<Checkbox checked={floorFilter === null} onChange={() => setFloorFilter(null)} />}
            label='All'
          />
          <FormControlLabel
            control={<Checkbox checked={floorFilter === 1} onChange={() => setFloorFilter(1)} />}
            label='1'
          />
          <FormControlLabel
            control={<Checkbox checked={floorFilter === 2} onChange={() => setFloorFilter(2)} />}
            label='2'
          />
          <FormControlLabel
            control={<Checkbox checked={floorFilter === 3} onChange={() => setFloorFilter(3)} />}
            label='3'
          />
          <FormControlLabel
            control={<Checkbox checked={floorFilter === 4} onChange={() => setFloorFilter(4)} />}
            label='4'
          />
        </Grid>
        <Box sx={{ display: 'flex' }}>
          <BedroomParentIcon fontSize='small' sx={{ marginRight: 2 }} />
          <Typography sx={{ paddingRight: 2 }}>Bed Available</Typography>
        </Box>
        <Grid container spacing={2} pb={5} pt={1}>
          <FormControlLabel
            control={<Checkbox checked={bedAvailableFilter === null} onChange={() => setBedAvailableFilter(null)} />}
            label='All'
          />
          <FormControlLabel
            control={<Checkbox checked={bedAvailableFilter === 0} onChange={() => setBedAvailableFilter(0)} />}
            label='0'
          />
          <FormControlLabel
            control={<Checkbox checked={bedAvailableFilter === 1} onChange={() => setBedAvailableFilter(1)} />}
            label='1'
          />
          <FormControlLabel
            control={<Checkbox checked={bedAvailableFilter === 2} onChange={() => setBedAvailableFilter(2)} />}
            label='2'
          />
          <FormControlLabel
            control={<Checkbox checked={bedAvailableFilter === 3} onChange={() => setBedAvailableFilter(3)} />}
            label='3'
          />
          <FormControlLabel
            control={<Checkbox checked={bedAvailableFilter === 4} onChange={() => setBedAvailableFilter(4)} />}
            label='4'
          />
        </Grid>

        <Grid container spacing={2} pb={5}>
          <Button
            onClick={() => {
              setBedAvailableFilter(null)
              setFloorFilter(null)
            }}
          >
            Clear
          </Button>
          <Button onClick={onClose}>Apply</Button>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default RoomFilterDialog
