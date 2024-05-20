import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { makeStyles } from '@mui/styles'
import RoomDetailsDialog from './RoomDetailsDialog'

const useStyles = makeStyles(theme => ({
  dialog: {
    minWidth: '100%',
    '& .MuiDialog-paper': {
      backgroundColor: '#FFD1DC',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      borderRadius: '15px'
    }
  },
  card: {
    padding: theme.spacing(2),
    borderRadius: '15px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing(2),
    opacity: 0,
    transform: 'scale(1) translateY(0)', // Start scaled up in the center
    animation: `$drop 0.5s ease forwards`,
    transition: 'transform 0.3s ease',

    '&.rank-1': {
      animationDelay: '0s'
    },
    '&.rank-2': {
      animationDelay: '1s'
    },
    '&.rank-3': {
      animationDelay: '2s'
    },
    '&:hover': {
      animation: `$drop 0.5s ease forwards, $scaleUp 0.5s ease forwards`
    }
  },
  cardContent: {
    textAlign: 'left'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  cardText: {
    fontSize: '1rem',
    margin: theme.spacing(1, 0)
  },
  actions: {
    justifyContent: 'center'
  },
  podium: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: theme.spacing(4),
    position: 'relative',
    height: '400px',
    width: '100%',
    bottom: '-150px'
  },
  podiumFirst: {
    order: 1
  },
  podiumSecond: {
    order: 2
  },
  podiumThird: {
    order: 3
  },

  '@keyframes drop': {
    '0%': {
      opacity: 0,
      transform: 'scale(1.25) translateY(0)',
      animationTimingFunction: 'ease-out'
    },
    '16.67%': {
      opacity: 1,
      transform: 'scale(1.25) translateY(0)',
      animationTimingFunction: 'ease-in-out'
    },
    '33.67%': {
      opacity: 1,
      transform: 'scale(1.25) translateY(0)',
      animationTimingFunction: 'ease-in-out'
    },
    '83.33%': {
      opacity: 1,
      transform: 'scale(1.25) translateY(0)',
      animationTimingFunction: 'ease-in-out'
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1) translateY(0)', // Scale down to final position
      animationTimingFunction: 'ease-in'
    }
  },
  '@keyframes scaleUp': {
    '0%': {
      transform: 'scale(1)'
    },
    '100%': {
      transform: 'scale(1.15)'
    }
  }
}))

export default function SmartReservationDialog({ roomData }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('xl')
  const [visibleCards, setVisibleCards] = React.useState([])
  const [openSecondDialog, setOpenSecondDialog] = React.useState(false)
  const [selectedRoomIndex, setSelectedRoomIndex] = React.useState(null)

  const handleOpenSecondDialog = index => {
    setSelectedRoomIndex(index)
    setOpenSecondDialog(true)
  }

  const handleCloseSecondDialog = () => {
    setOpenSecondDialog(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
    setVisibleCards([0, 1, 2])
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Button variant='outlined' onClick={handleClickOpen}>
        Open max-width dialog
      </Button>
      <RoomDetailsDialog
        open={openSecondDialog}
        handleClose={handleCloseSecondDialog}
        roomData={roomData}
        selectedRoomIndex={selectedRoomIndex}
      />
      <Dialog maxWidth={maxWidth} open={open} onClose={handleClose} classes={{ paper: classes.dialog }} fullScreen>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              variant='h3'
              align='center'
              style={{
                backgroundColor: 'white',
                padding: '5px',
                display: 'inline-block',
                maxWidth: '80%'
              }}
            >
              Matching Room Results!
            </Typography>
          </div>
          <Box className={`${classes.podium}`}>
            {visibleCards.includes(1) && (
              <Box className={` ${classes.podiumSecond}`} style={{ margin: '20px' }}>
                <Card key={1} className={`${classes.card} rank-2`}>
                  <CardContent>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src='https://img2.pic.in.th/pic/silver-medal_1910534.png'
                        alt='Silver Medal'
                        style={{ width: '100px', height: '100px' }}
                      />
                    </div>

                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                      <div className={classes.cardTitle}>Ranking: 2 ({roomData[1].totalMatches} points)</div>
                      <div className={classes.cardText}>
                        <b>Room Number:</b> {roomData[1].room_number}
                      </div>
                      <div className={classes.cardText}>
                        <b>Room Status:</b> {roomData[1].bed_available} / {roomData[1].bed_capacity}
                      </div>
                    </Typography>
                  </CardContent>
                  <CardActions className='card-action-dense'>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Button onClick={() => handleOpenSecondDialog(1)}>Details</Button>
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            )}
            {visibleCards.includes(0) && (
              <Box className={` ${classes.podiumFirst}`} style={{ margin: '20px' }}>
                <Card key={0} className={`${classes.card} rank-1`}>
                  <CardContent>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/gold-medal_1910528.png'
                        alt='Gold Medal'
                        style={{ width: '100px', height: '100px' }}
                      />
                    </div>

                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                      <div className={classes.cardTitle}>Ranking: 1 ({roomData[0].totalMatches} points)</div>
                      <div className={classes.cardText}>
                        <b>Room Number:</b> {roomData[0].room_number}
                      </div>
                      <div className={classes.cardText}>
                        <b>Room Status:</b> {roomData[0].bed_available} / {roomData[0].bed_capacity}
                      </div>
                    </Typography>
                  </CardContent>
                  <CardActions className='card-action-dense'>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Button onClick={() => handleOpenSecondDialog(0)}>Details</Button>
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            )}
            {visibleCards.includes(2) && (
              <Box className={` ${classes.podiumThird}`} style={{ margin: '20px' }}>
                <Card key={2} className={`${classes.card} rank-3 `}>
                  <CardContent>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/bronze-medal_1910542.png'
                        alt='Bronze Medal'
                        style={{ width: '100px', height: '100px' }}
                      />
                    </div>
                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                      <div className={classes.cardTitle}>Ranking: 3 ({roomData[2].totalMatches} points)</div>
                      <div className={classes.cardText}>
                        <b>Room Number:</b> {roomData[2].room_number}
                      </div>
                      <div className={classes.cardText}>
                        <b>Room Status:</b> {roomData[2].bed_available} / {roomData[2].bed_capacity}
                      </div>
                    </Typography>
                  </CardContent>
                  <CardActions className='card-action-dense'>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Button onClick={() => handleOpenSecondDialog(2)}>Details</Button>
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
