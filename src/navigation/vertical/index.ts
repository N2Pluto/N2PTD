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
import ApartmentIcon from '@mui/icons-material/Apartment' // New icon for Dormitory
import BookOnlineIcon from '@mui/icons-material/BookOnline' // New icon for Reservation
import PersonIcon from '@mui/icons-material/Person' // New icon for Profile
import RequestPageIcon from '@mui/icons-material/RequestPage'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { userStore } from 'src/stores/userStore'
import { useEffect, useState } from 'react'

const useNavigation = (): VerticalNavItemsType => {
  const { user } = userStore()
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [reservation, setReservation] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

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

    fetchReservationData()
  }, [user])

  console.log('reservation', reservation)

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
      sectionTitle: 'Form Req',
      icon: DnsOutlinedIcon,
      children: [
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
        },
        {
          title: 'Form Request',
          icon: GoogleIcon,
          path: '/admin/googleForm'
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
    {
      title: 'Reservation',
      icon: BookOnlineIcon,
      path: '/reservation'
    },
    {
      title: 'My Profile',
      icon: PersonIcon,
      path: '/profile'
    },
    // {
    //   title: 'Form Request',
    //   icon: RequestPageIcon,
    //   path: '/userGoogleForm'
    // },
    {
      sectionTitle: 'Form',
      icon: CorporateFareOutlinedIcon,
      children: [
        {
          title: 'Edit Profile',
          icon: DomainAddOutlinedIcon,
          path: '/userGoogleForm/editCard'
        },
        {
          title: 'Change Room',
          icon: CorporateFareOutlinedIcon,
          path: '/userGoogleForm/changeCard'
        },
        {
          title: 'Transfer Room',
          icon: CorporateFareOutlinedIcon,
          path: '/userGoogleForm/transferCard'
        }
      ]
    }
  ]

  if (reservation?.status === 'Approve' && reservation?.payment_status === 'SUCCESS') {
    const updatedNavItemsForUser = navItemsForUser.map(item =>
      item.title === 'Reservation'
        ? {
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
