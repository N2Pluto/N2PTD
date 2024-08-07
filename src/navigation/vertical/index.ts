import React, { useEffect, useState } from 'react'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup'
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined'
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import ChecklistIcon from '@mui/icons-material/Checklist'
import GoogleIcon from '@mui/icons-material/Google'
import ApartmentIcon from '@mui/icons-material/Apartment'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import PersonIcon from '@mui/icons-material/Person'
import LogoDevIcon from '@mui/icons-material/LogoDev'
import PsychologyIcon from '@mui/icons-material/Psychology'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import GamepadIcon from '@mui/icons-material/Gamepad'
import CreateIcon from '@mui/icons-material/Create'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { userStore } from 'src/stores/userStore'

const useNavigation = (): VerticalNavItemsType => {
  const { user } = userStore()
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [reservation, setReservation] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [residentData, setResidentData] = useState<any>(null)
  const [form, setForm] = useState<any[] | null>(null)

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

        if (data.userData.role === 'admin') {
          setRoleFilter('admin')
        } else if (data.userData.role === 'user') {
          setRoleFilter('user')
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
    const fetchReservationData = async () => {
      try {
        const response = await fetch(`/api/reservation/select?user_id=${user?.user_id}`)
        const { reservationData, userInfoData } = await response.json()
        setReservation(reservationData[0])
        setUserInfo(userInfoData[0])
      } catch (error) {
        console.error('Error fetching reservation data:', error)
      }
    }

    if (user?.user_id) {
      fetchReservationData()
      const intervalId = setInterval(fetchReservationData, 5000)

      return () => clearInterval(intervalId)
    }
  }, [user])

  useEffect(() => {
    const fetchResidentData = async () => {
      try {
        const response = await fetch(`/api/reservation/checkResident?user_id=${user?.user_id}`)
        const { residentData } = await response.json()
        setResidentData(residentData[0])
      } catch (error) {
        console.error('Error fetching resident data:', error)
      }
    }

    if (user?.user_id) {
      fetchResidentData()
      const intervalId = setInterval(fetchResidentData, 5000)

      return () => clearInterval(intervalId)
    }
  }, [user])

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch('/api/admin/googleForm/read/')
        const result = await response.json()
        setForm(result.data)
      } catch (error) {
        console.error('Error fetching form data:', error)
      }
    }

    fetchFormData()
    const intervalId = setInterval(fetchFormData, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const navItemsForAdmin = [
    {
      title: 'Home Page',
      icon: HomeOutline,
      path: '/admin/home'
    },
    {
      title: 'Import Data',
      icon: AccountPlusOutline,
      path: '/admin/importStudent'
    },

    {
      sectionTitle: 'Approve',
      icon: CheckBoxOutlinedIcon,
      children: [
        {
          title: 'Reservation',
          icon: BookOnlineIcon,
          path: '/admin/reservationApprove'
        },
        {
          title: 'Resident',
          icon: DoneAllOutlinedIcon,
          path: '/admin/residentApprove'
        },
        {
          title: 'Renewal',
          icon: ChecklistIcon,
          path: '/admin/renewalSystem'
        }
      ]
    },
    {
      sectionTitle: 'Information',
      icon: DnsOutlinedIcon,
      children: [
        {
          title: 'Resident Info',
          icon: ApartmentIcon,
          path: '/admin/dormitoryResident'
        },
        {
          title: 'User Info',
          icon: PersonIcon,
          path: '/admin/userManagement'
        }
      ]
    },
    {
      sectionTitle: 'Create',
      icon: AutorenewIcon,
      children: [
        {
          title: 'Booking Period',
          icon: WifiProtectedSetupIcon,
          path: '/admin/reservationSystem'
        },
        {
          title: 'Renewal Period',
          icon: AutorenewIcon,
          path: '/admin/renewalDormitory'
        }
      ]
    },
    {
      sectionTitle: 'Building',
      icon: CorporateFareOutlinedIcon,
      children: [
        {
          title: 'Building System',
          icon: DomainAddOutlinedIcon,
          path: '/admin/building'
        },
        {
          title: 'Building Control',
          icon: CorporateFareOutlinedIcon,
          path: '/admin/controlRoom'
        }
      ]
    },
    {
      sectionTitle: 'Form',
      icon: DnsOutlinedIcon,
      children: [
        {
          title: 'Form Control',
          icon: GoogleIcon,
          path: '/admin/googleForm'
        },
        {
          title: 'Edit Profile',
          icon: ApartmentIcon,
          path: '/admin/form/editProfileForm'
        },
        {
          title: 'Change Room',
          icon: ApartmentIcon,
          path: '/admin/form/changeRoomForm'
        },
        {
          title: 'Transfer Room',
          icon: PersonIcon,
          path: '/admin/form/transferRoomForm'
        }
      ]
    },
    {
      sectionTitle: 'LOGS',
      icon: LogoDevIcon,
      children: [
        {
          title: 'Student',
          icon: PsychologyIcon,
          path: '/admin/log-user-reservation'
        },
        {
          title: 'Approve',
          icon: AssignmentTurnedInIcon,
          path: '/admin/log-admin-approve'
        },
        {
          title: 'Create',
          icon: CreateIcon,
          path: '/admin/log-admin-create'
        },
        {
          title: 'Building control',
          icon: GamepadIcon,
          path: '/admin/log-admin-buildingcontrol'
        }
      ]
    }
  ]

  const navItemsForUser = [
    {
      title: 'Home Page',
      icon: HomeOutline,
      path: '/dashboard'
    },
    {
      title: 'Dormitory',
      icon: ApartmentIcon,
      path: '/Dormitory'
    },
    reservation
      ? {
          title: 'Reservation Info',
          icon: BookOnlineIcon,
          path: '/reservation-info'
        }
      : {
          title: 'Reservation',
          icon: BookOnlineIcon,
          path: '/reservation'
        },
    {
      title: 'My Profile',
      icon: PersonIcon,
      path: '/profile'
    },
    {
      sectionTitle: 'Form',
      icon: CorporateFareOutlinedIcon,
      children: [
        ...(form && form.find(f => f.id === 1 && f.status)
          ? [
              {
                title: 'Edit Profile',
                icon: DomainAddOutlinedIcon,
                path: '/userGoogleForm/editCard'
              }
            ]
          : []),
        ...(form && form.find(f => f.id === 2 && f.status && residentData)
          ? [
              {
                title: 'Change Room',
                icon: CorporateFareOutlinedIcon,
                path: '/userGoogleForm/changeCard'
              }
            ]
          : []),
        ...(form && form.find(f => f.id === 3 && f.status && residentData)
          ? [
              {
                title: 'Transfer Room',
                icon: CorporateFareOutlinedIcon,
                path: '/userGoogleForm/transferCard'
              }
            ]
          : [])
      ]
    }
  ]

  if (reservation?.status === 'Approve' && reservation?.payment_status === 'SUCCESS') {
    const updatedNavItemsForUser = navItemsForUser.map(item =>
      item.title === (reservation ? 'Reservation Info' : 'Reservation')
        ? {
            ...item,
            title: 'My Dormitory',
            icon: FeedOutlinedIcon,
            path: '/mydormitory'
          }
        : item
    )

    return updatedNavItemsForUser
  }

  if (roleFilter === 'admin') {
    return navItemsForAdmin
  } else if (roleFilter === 'user') {
    return navItemsForUser
  }

  return []
}

export default useNavigation
