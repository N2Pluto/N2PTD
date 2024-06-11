import React from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import GroupIcon from '@mui/icons-material/Group'
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import HotelIcon from '@mui/icons-material/Hotel'
import ShowerIcon from '@mui/icons-material/Shower'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import RefreshIcon from '@mui/icons-material/Refresh'

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  filters: {
    buildingFilter: string
    setBuildingFilter: (value: string) => void
    roommateFilter: string
    setRoommateFilter: (value: string) => void
    bathroomFilter: string
    setBathroomFilter: (value: string) => void
    bedFilter: string
    setBedFilter: (value: string) => void
    priceFilter: number | ''
    setPriceFilter: (value: number | '') => void
  }
  disableScrollLock?: boolean
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  disableScrollLock = false,
  filters: {
    buildingFilter,
    setBuildingFilter,
    roommateFilter,
    setRoommateFilter,
    bathroomFilter,
    setBathroomFilter,
    bedFilter,
    setBedFilter,
    priceFilter,
    setPriceFilter
  }
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
            backgroundColor: 'transparent'
          }
        }
      }}
    >
      <Box sx={{ width: 300, padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ pb: 2, pt: 5, pr: 2, ml: 4, fontWeight: 'bold' }}>
            Filter Building
          </Typography>
          <IconButton
            color='secondary'
            onClick={() => {
              setBuildingFilter('')
              setRoommateFilter('')
              setBathroomFilter('')
              setBedFilter('')
              setPriceFilter('')
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
              Roommate
            </Typography>
          </Box>
          <Grid container spacing={0} pb={3} pt={1}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={roommateFilter === ''} onChange={() => setRoommateFilter('')} />}
                label='All'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={roommateFilter === '2'} onChange={() => setRoommateFilter('2')} />}
                label='2 Person'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={roommateFilter === '4'} onChange={() => setRoommateFilter('4')} />}
                label='4 Person'
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Room type
            </Typography>
          </Box>
          <Grid container spacing={0} pb={3} pt={1}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={buildingFilter === ''} onChange={() => setBuildingFilter('')} />}
                label='All'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio
                    checked={buildingFilter === 'Air conditioner'}
                    onChange={() => setBuildingFilter('Air conditioner')}
                  />
                }
                label='Air conditioner'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio checked={buildingFilter === 'Ceiling fan'} onChange={() => setBuildingFilter('Ceiling fan')} />
                }
                label='Ceiling fan'
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Bed Type
            </Typography>
          </Box>
          <Grid container spacing={0} pb={3} pt={1}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={bedFilter === ''} onChange={() => setBedFilter('')} />}
                label='All'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={bedFilter === 'single bed'} onChange={() => setBedFilter('single bed')} />}
                label='Single Bed'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={bedFilter === 'bunk bed'} onChange={() => setBedFilter('bunk bed')} />}
                label='Bunk Bed'
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Bathroom Type
            </Typography>
          </Box>
          <Grid container spacing={0} pb={3} pt={1}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={bathroomFilter === ''} onChange={() => setBathroomFilter('')} />}
                label='All'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio
                    checked={bathroomFilter === 'shared bathroom'}
                    onChange={() => setBathroomFilter('shared bathroom')}
                  />
                }
                label='Shared Bathroom'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Radio
                    checked={bathroomFilter === 'en suite bathroom'}
                    onChange={() => setBathroomFilter('en suite bathroom')}
                  />
                }
                label='En-Suite Bathroom'
                sx={{ ml: 2 }}
              />
            </Grid>
          </Grid>
          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ paddingRight: 2, ml: 4, fontWeight: 'bold' }}>
              Price / Term
            </Typography>
          </Box>
          <Grid container spacing={0} pb={3} pt={1}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={priceFilter === ''} onChange={() => setPriceFilter('')} />}
                label='All'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={priceFilter === 5400} onChange={() => setPriceFilter(5400)} />}
                label='5400 baht'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={priceFilter === 7200} onChange={() => setPriceFilter(7200)} />}
                label='7200 baht'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={priceFilter === 9600} onChange={() => setPriceFilter(9600)} />}
                label='9600 baht'
                sx={{ ml: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Radio checked={priceFilter === 15000} onChange={() => setPriceFilter(15000)} />}
                label='15000 baht'
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

export default FilterDrawer
