import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState, useEffect } from 'react'

interface EditChangeRoomProps {
  id: string
}

interface Data {
  ประทับเวลา: string
  StudentID: string
  Username: string
  Building: string
  Room: string
  Bed: string
  status: string
  email: string
  topic: string
  id: string
}

export default function EditChangeRoom({ id }: EditChangeRoomProps) {
  console.log(id)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [newUsers, setNewUsers] = useState<Data[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(` /api/admin/dormitoryResident/dormitoryResidentForm/changeRoomForm/read/${id}/`)
        const { data } = await response.json()
        if (data) {
          setNewUsers(Array.isArray(data) ? data : [data])
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()
  }, [id])

  console.log('newUsers', newUsers)

  const handleUpdate = async (status: 'success' | 'reject') => {
    const response = await fetch(`/api/admin/dormitoryResident/dormitoryResidentForm/changeRoomForm/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        id
      })
    })
    const data = await response.json()
    console.log(data)

    // If the request was successful, close the menu and send an email
    if (response.ok) {
      handleClose()

      // Prepare email content based on the status
      const emailSubject = status === 'success' ? 'Change Room Successfully' : 'Change Room Cancel'
      const emailHtml =
        status === 'success'
          ? `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50;">Change Room Request Approved</h2>
          <p>Dear ${newUsers[0].Username},</p>
          <p>We are pleased to inform you that your room change request has been approved.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Building</th>
              <td style="padding: 8px;">${newUsers[0].Building}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Room</th>
              <td style="padding: 8px;">${newUsers[0].Room}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 8px; background-color: #f2f2f2;">Bed</th>
              <td style="padding: 8px;">${newUsers[0].Bed}</td>
            </tr>
          </table>
          <p>Thank you for your patience. If you have any questions, please feel free to contact us.</p>
          <p>Best regards,</p>
          <p>The Dormitory Management Team</p>
        </div>
      `
          : `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #FF0000;">Change Room Request Rejected</h2>
          <p>Dear ${newUsers[0].Username},</p>
          <p>We regret to inform you that your room change request has been rejected.</p>
          <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>
          <p>Best regards,</p>
          <p>The Dormitory Management Team</p>
        </div>
      `

      // Send an email
      const emailResponse = await fetch(`/api/admin/user/userForm/nodemailer/nodemailer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: newUsers[0].email,
          subject: emailSubject,
          html: emailHtml
        })
      })

      if (!emailResponse.ok) {
        console.error('Failed to send an email')
      }
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        id='demo-positioned-button'
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={() => handleUpdate('success')}>ยืนยัน</MenuItem>
        <MenuItem onClick={() => handleUpdate('reject')}>ปฏิเสธ</MenuItem>
      </Menu>
    </div>
  )
}
