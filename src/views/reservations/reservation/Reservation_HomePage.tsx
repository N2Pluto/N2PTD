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

import SuccessฺฺBar from './component'
import { sendDiscordMessage } from 'src/pages/api/discord/user'
import Link from 'next/link'

const ReservationHomePage = () => {
  const { user } = userStore()

  const [profileData, setProfileData] = useState(null)
  const [isEligible, setIsEligible] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [roundData, setRoundData] = useState(null)

  const handleNavigate = async () => {
    const intervalId = setInterval(async () => {
      try {
        // Extract the first two characters of the student_id
        const userYear = profileData?.userData?.student_id.toString().slice(0, 2)
        const response = await fetch('/api/reservation/checkReservationQualification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // Send the extracted userYear
          body: JSON.stringify({ userYear })
        })
        const data = await response.json()
        setIsEligible(data.isEligible)

        if (data.isEligible) {
          clearInterval(intervalId) // Stop the interval when the user is eligible
          router.push('/reservation/reservation')
        } else {
          setTimeout(() => {
            setShowDialog(true)
          }, 1500)
        }
      } catch (error) {
        // console.error('Error checking reservation qualification:', error)
      }
    }, 1000) // Fetch every second
  }

  useEffect(() => {
    const fetchRoundProfile = async () => {
      try {
        const response = await fetch('/api/reservation/fetchRoundProfile', {
          method: 'GET'
        })
        const data = await response.json()
        setRoundData(data)
        console.log('Round Info', data)
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

  useEffect(() => {
    handleNavigate()
  }, [profileData])

  return (
    <>
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
          <Link href='/dashboard'>
            <Button onClick={() => setShowDialog(false)} autoFocus>
              ปิด
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReservationHomePage
