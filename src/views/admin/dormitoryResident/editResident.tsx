import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import TransferRoom from './dormitoryTransferRoom'
import ChangeRoom from './dormitoryChangeRoom'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}))

interface EditResidentProps {
  id: string
  resetSelected: () => void
  onOpenSnackbar: () => void
}

export default function EditResident({ id, resetSelected, onOpenSnackbar }: EditResidentProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [openTransferRoom, setOpenTransferRoom] = React.useState(false)
  const [openChangeRoom, setOpenChangeRoom] = React.useState(false)
  const open = Boolean(anchorEl)

  console.log('edit room id ', id)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenTransferRoom = () => {
    setOpenTransferRoom(true)
    handleClose()
  }

  const handleCloseTransferRoom = () => {
    setOpenTransferRoom(false)
  }

  const handleOpenChangeRoom = () => {
    setOpenChangeRoom(true)
    handleClose()
  }

  const handleCloseChangeRoom = () => {
    setOpenChangeRoom(false)
  }

  return (
    <div>
      <Button
        id='demo-customized-button'
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <StyledMenu
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {/* <MenuItem onClick={handleOpenTransferRoom} disableRipple>
          แลกเปลี่ยนห้อง
        </MenuItem> */}
        <MenuItem onClick={handleOpenChangeRoom} disableRipple>
          ย้ายห้อง
        </MenuItem>
      </StyledMenu>
      <TransferRoom open={openTransferRoom} onClose={handleCloseTransferRoom} id={id} />
      <ChangeRoom
        open={openChangeRoom}
        onClose={handleCloseChangeRoom}
        id={id}
        resetSelected={resetSelected}
        onOpenSnackbar={onOpenSnackbar}
      />
    </div>
  )
}
