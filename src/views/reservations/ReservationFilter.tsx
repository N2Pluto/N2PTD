// ** MUI Imports
import Card from '@mui/material/Card'
// import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'
import ReservationSlide from './ReservationSlide'
import ReservationButton from './ReservationButton'

const ReservationFilter = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant='h6' sx={{ marginBottom: 2 }}>
                    Average price per night
                </Typography>
                <Grid item xs={12}>
                    <Grid container spacing={2} sx={{ display: 'flex' }}>
                        <Grid item xs={5}>
                            <TextField fullWidth type='Min' label='Min' placeholder='Input your number' />
                        </Grid>

                        <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant='body1'>-</Typography>
                        </Grid>

                        <Grid item xs={5}>
                            <TextField fullWidth type='Max' label='Max' placeholder='Input your number' />
                        </Grid>
                    </Grid>
                </Grid>
                <ReservationSlide />
                
        <Grid container spacing={2} sx={{ display: 'flex' }}>
            <Grid item xs={5} sx={{}}>
                <Typography variant='body1'>Private Rooms</Typography>
            </Grid>
            <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'flex-end' , mt:-2 }}>
                <ReservationButton />
            </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ReservationFilter
