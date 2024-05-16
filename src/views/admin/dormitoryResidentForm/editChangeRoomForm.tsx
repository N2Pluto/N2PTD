import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface EditChangeRoomProps {
  id: string
}

export default function EditChangeRoom({ id }: EditChangeRoomProps) {
  console.log(id)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

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

    // If the request was successful, close the menu
    if (response.ok) {
      handleClose()
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
