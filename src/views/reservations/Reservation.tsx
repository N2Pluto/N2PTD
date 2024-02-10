// ** MUI Imports
import Card from '@mui/material/Card'
// import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'

const ReservationInfo = () => {
    return (
        <Card>
            <Box sx={{ mb: 0, display: 'flex' }}>
                <Box
                    component='img'
                    src={'https://img5.pic.in.th/file/secure-sv1/wu.png'}
                    sx={{ height: '20.5625rem' }}
                    alt='logo'
                ></Box>
                <Typography
                    variant='h6'
                    sx={{
                        ml: 3,
                        lineHeight: 1,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '1.5rem !important'
                    }}
                >
                    <CardContent>
                        <Typography variant='h6' sx={{ marginBottom: 2 }}>
                            WU Dormitory 1
                        </Typography>
                        <Typography variant='body2'>
                            - Dormitory fee: 10,000 baht per person per semester. <br /> - Monthly electricity bill payment.
                        </Typography>
                        <Link href='/reservations/10'>
                            <Box
                                sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'end', pt: 35, pr: 2 }}
                            >
                                <Button variant='contained'>Reservation Now!</Button>
                            </Box>
                        </Link>
                    </CardContent>
                </Typography>
            </Box>
        </Card>
    )
}

export default ReservationInfo
