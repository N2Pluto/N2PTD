import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  dialog: {
    minWidth: '80vw', // Adjusted width for better responsiveness
    padding: theme.spacing(3) // Add padding for better spacing
  },
  card: {
    marginBottom: theme.spacing(3), // Increase bottom margin for separation
    boxShadow: theme.shadows[5] // Utilize theme shadows for consistency
  },
  cardTitle: {
    fontSize: '1.2rem', // Increase font size slightly
    fontWeight: 'bold',
    marginBottom: theme.spacing(1) // Add bottom margin for separation
  },
  cardText: {
    fontSize: '1rem',
    marginBottom: theme.spacing(1) // Add bottom margin for separation
  },
  actions: {
    justifyContent: 'center',
    paddingTop: theme.spacing(2) // Add top padding for separation
  }
}))

const RoomDetailsDialog = ({ open, handleClose, roomData, selectedRoomIndex }) => {
  const classes = useStyles()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='room-details-dialog-title'
      classes={{ paper: classes.dialog }}
    >
      <DialogTitle id='room-details-dialog-title'>Room Details</DialogTitle>
      <DialogContent>
        {selectedRoomIndex !== null && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent style={{ height: '350px' }}>
                  <Typography variant='h6' className={classes.cardTitle}>
                    User Requests
                  </Typography>
                  <Typography className={classes.cardText}>
                    <b>User:</b>{' '}
                    {roomData[selectedRoomIndex].userSchoolReq.replace('find roommates who attend the ', '')},{' '}
                    {roomData[selectedRoomIndex].userMajorReq.replace('find roommates who study the ', '')},{' '}
                    {roomData[selectedRoomIndex].userReligionReq.replace('find roommates from ', '')}
                  </Typography>
                  <Typography className={classes.cardText}>
                    <b style={{ textDecoration: 'underline' }}> {roomData[selectedRoomIndex].userSchool} </b>
                    is Matching with {roomData[selectedRoomIndex].scoreSchool} Person.
                  </Typography>
                  <Typography className={classes.cardText}>
                    <b style={{ textDecoration: 'underline' }}>{roomData[selectedRoomIndex].userMajor}</b> is Matching
                    with {roomData[selectedRoomIndex].scoreMajor} Person.
                  </Typography>
                  <Typography className={classes.cardText}>
                    <b style={{ textDecoration: 'underline' }}>{roomData[selectedRoomIndex].userReligion}</b> is
                    Matching with {roomData[selectedRoomIndex].scoreReligion} Person.
                  </Typography>

                  {/* Additional user request details can be added similarly */}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className={classes.card}>
                <CardContent style={{ height: '350px' }}>
                  <Typography variant='h6' className={classes.cardTitle}>
                    Activity & Other Requests
                  </Typography>
                  <Typography className={classes.cardText}>
                    <b>Activity Request:</b> {roomData[selectedRoomIndex].userActivityReq}
                  </Typography>
                  <Typography className={classes.cardText}>
                    <b>Red Flag Request:</b> {roomData[selectedRoomIndex].userRedflagReq}
                  </Typography>
                  <Typography className={classes.cardText}>
                    <b>Sleep Request:</b> {roomData[selectedRoomIndex].userSleepReq}
                  </Typography>
                  <Typography className={classes.cardText}>
                    {roomData[selectedRoomIndex].scoreActivity === 0 ? (
                      'No Activities Match.'
                    ) : (
                      <Typography>
                        <b style={{ textDecoration: 'underline' }}>
                          {roomData[selectedRoomIndex].matchActivityEachRoom}:
                        </b>{' '}
                        Activities is Matching with {roomData[selectedRoomIndex].scoreActivity} Person
                      </Typography>
                    )}
                  </Typography>

                  <Typography className={classes.cardText}>
                    {roomData[selectedRoomIndex].scoreRedflag === 0 ? (
                      'No Redflag Match.'
                    ) : (
                      <>
                        <b style={{ textDecoration: 'underline' }}>
                          {roomData[selectedRoomIndex].matchRedflagEachRoom}:
                        </b>{' '}
                        Redflag is Matching with {roomData[selectedRoomIndex].scoreRedflag} Person.
                      </>
                    )}
                  </Typography>
                  <Typography className={classes.cardText}>
                    <b style={{ textDecoration: 'underline' }}> {roomData[selectedRoomIndex].userSleepReq}</b> is
                    Matching with {roomData[selectedRoomIndex].scoreSleep} Person.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleClose} variant='contained' color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoomDetailsDialog
