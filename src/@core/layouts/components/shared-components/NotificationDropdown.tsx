// ** React Imports
import { useState, SyntheticEvent, Fragment, ReactNode, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Badge from '@mui/material/Badge'

// ** Icons Imports
import BellOutline from 'mdi-material-ui/BellOutline'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

import router from 'next/router'
import RenewalChooseForm from 'src/views/admin/renewalDormitory/renewalChooseForm'

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
})

// ** Styled Avatar component
const Avatar = styled(MuiAvatar)<AvatarProps>({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const NotificationDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const [userManagement, setUserManagement] = useState<any[]>([])
  const [changeRoom, setChangeRoom] = useState<any[]>([])
  const [transferRoom, setTransferRoom] = useState<any[]>([])

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleRouter1 = () => {
    RenewalChooseForm()
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch(`/api/admin/user/userForm/read/fetch_form`).then(res => res.json())
        if (data) {
          setUserManagement(data) // Corrected line
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()
  }, [])
  console.log('test', userManagement)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        '/api/admin/dormitoryResident/dormitoryResidentForm/changeRoomForm/read/fetch_changeRoom'
      )
      const result = await response.json()
      const mappedData = result.data.map((item: any) => ({
        id: item.id,
        status: item.status
      }))
      setChangeRoom(mappedData)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        '/api/admin/dormitoryResident/dormitoryResidentForm/transferForm/read/fetch_transferRoom'
      )
      const result = await response.json()
      const mappedData = result.data.map((item: any) => ({
        id: item.id,
        status: item.status
      }))
      setTransferRoom(mappedData) // Set the rows to the mapped data
    }

    fetchData()
  }, [])

  const userManagementForm = userManagement.filter(r => r.status === '').length
  const changeRoomForm = changeRoom.filter(r => r.status === '').length
  const transferRoomForm = transferRoom.filter(r => r.status === '').length
  const all = userManagementForm + changeRoomForm + transferRoomForm
  console.log('userManagementForm', userManagementForm)
  console.log('changeRoomForm', changeRoomForm)

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge badgeContent={all > 0 ? all : 0} color='primary'>
          <BellOutline />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            {all > 0 ? (
              <Chip
                size='small'
                label={all + ' New'}
                color='primary'
                sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
              />
            ) : (
              ''
            )}
          </Box>
        </MenuItem>
        <ScrollWrapper>

          {changeRoomForm > 0 ? (
            <MenuItem onClick={handleRouter1}>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <ChangeCircleIcon />
                <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                  <MenuItemTitle>แบบฟอร์มย้ายห้อง</MenuItemTitle>
                </Box>
                {changeRoomForm > 0 ? (
                  <Chip
                    size='small'
                    label={changeRoomForm}
                    color='primary'
                    sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
                  />
                ) : (
                  <Typography variant='caption' sx={{ color: 'red' }}></Typography>
                )}
              </Box>
            </MenuItem>
          ) : (
            ''
          )}

        </ScrollWrapper>
        <MenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        ></MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
