// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { userStore } from 'src/stores/userStore'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Grid, { GridProps } from '@mui/material/Grid'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import HomeIcon from '@mui/icons-material/Home'
import Link from 'next/link'
import SuccessฺฺBar from './component'
import { sendDiscordMessage } from 'src/pages/api/discord/user'

const ReservationHomePage = () => {
  const { user } = userStore()

  const [profileData, setProfileData] = useState(null)
  const [isEligible, setIsEligible] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [roundData, setRoundData] = useState(null)

  const handleNavigate = async () => {
    try {
      const response = await fetch('/api/reservation/checkReservationQualification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userYear: profileData?.userInfoData?.student_year })
      })
      const data = await response.json()
      setIsEligible(data.isEligible)

      if (data.isEligible) {
        router.push('/reservation/reservation')
      } else {
        setShowDialog(true)
      }
    } catch (error) {
      console.error('Error checking reservation qualification:', error)
    }
  }

  useEffect(() => {
    const fetchRoundProfile = async () => {
      try {
        const response = await fetch('/api/reservation/fetchRoundProfile', {
          method: 'GET'
        })
        const data = await response.json()
        setRoundData(data)
        console.log('Round Info' , data)
      } catch (error) {
        console.error('Error fetching round profile:', error)
      }
    }
    fetchRoundProfile()
  }, [])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/fetchUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id })
        })
        const data = await response.json()
        setProfileData(data)
        console.log(data)

        // Check round status
        const roundResponse = await fetch('/api/reservation/checkRoundStatus', {
          method: 'GET'
        })
        const roundData = await roundResponse.json()

        if (roundResponse.status === 500) {
          console.error('Error checking round status:', roundData.error)
        } else if (roundResponse.status === 404) {
          console.error('No active round found')
        } else {
          console.log('Round status checked successfully')
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])

  return (
    <>
      <Typography variant='h6'>User Info</Typography>
      <div>user_id : {profileData?.userInfoData?.user_id}</div>
      <div>student year : {profileData?.userInfoData?.student_year}</div>
      <Typography variant='h6'>Round Info</Typography>
      <div>round_id : {roundData?.data?.id}</div>
      <div>round_name : {roundData?.data?.round_name}</div>
      <div>start_date : {roundData?.data?.start_date}</div>
      <div>end_date : {roundData?.data?.end_date}</div>
      <Card sx={{ position: 'relative' }}>
        <Button onClick={handleNavigate}>CHECK</Button>
      </Card>
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>คุณไม่มีคุณสมบัติในการจองห้องพักในรอบนี้</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            กรุณาตรวจสอบคุณสมบัติของคุณอีกครั้ง หากคุณมีคำถามเพิ่มเติม กรุณาติดต่อเจ้าหน้าที่
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} autoFocus>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReservationHomePage