// /src/navigation/vertical/index.ts

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

  if (roleFilter === 'admin') {
    return [
      {
        title: 'หน้าหลัก',
        icon: HomeOutline,
        path: '/admin/home'
      },
      {
        title: 'นำเข้าข้อมูล',
        icon: AccountPlusOutline,
        path: '/admin/importStudent'
      },

      {
        sectionTitle: 'ศูนย์รวมข้อมูล',
        icon: DnsOutlinedIcon,
        children: [
          {
            title: 'ข้อมูลผู้อยู่อาศัย',
            icon: ApartmentIcon, // Updated icon
            path: '/admin/dormitoryResident'
          },
          {
            title: 'ข้อมูลผู้ใช้',
            icon: PersonIcon, // Updated icon
            path: '/admin/userManagement'
          }
        ]
      },
      {
        sectionTitle: 'การอนุมัติ',
        icon: CheckBoxOutlinedIcon,
        children: [
          {
            title: 'อนุมัติการจอง',
            icon: BookOnlineIcon, // Updated icon
            path: '/admin/reservationApprove'
          },
          {
            title: 'อนุมัติผู้อยู่อาศัย',
            icon: DoneAllOutlinedIcon,
            path: '/admin/residentApprove'
          },
          {
            title: 'อนุมัติผู้อยู่ต่อ',
            icon: ChecklistIcon,
            path: '/admin/renewalSystem'
          }
        ]
      },
      {
        sectionTitle: 'การสร้าง',
        icon: AutorenewIcon,
        children: [
          {
            title: 'สร้างรอบการจอง',
            icon: WifiProtectedSetupIcon,
            path: '/admin/reservationSystem'
          },
          {
            title: 'สร้างฟอร์มการอยู่ต่อ',
            icon: AutorenewIcon,
            path: '/admin/renewalDormitory'
          },
          {
            title: 'สร้างแบบฟอร์มประกาศ',
            icon: GoogleIcon,
            path: '/admin/googleForm'
          }
        ]
      },
      {
        sectionTitle: 'ควบคุม',
        icon: CorporateFareOutlinedIcon,
        children: [
          {
            title: 'การควบคุมตึก',
            icon: CorporateFareOutlinedIcon,
            path: '/admin/buildingControl'
          },
          {
            title: 'สร้างตึก',
            icon: DomainAddOutlinedIcon,
            path: '/admin/building'
          }
        ]
      }
    ]
  } else if (roleFilter === 'user') {
    return [
      {
        title: 'Home',
        icon: HomeOutline,
        path: '/dashboard'
      },
      {
        title: 'Dormitory',
        icon: ApartmentIcon, // Updated icon
        path: '/Dormitory'
      },
      {
        title: 'Reservation',
        icon: BookOnlineIcon, // Updated icon
        path: '/reservation'
      },
      {
        title: 'Profile',
        icon: PersonIcon, // Updated icon
        path: '/profile'
      },
      {
        title: 'Request Form',
        icon: RequestPageIcon, // Updated icon
        path: '/userGoogleForm'
      }
    ]
  }

  return []
}

export default useNavigation
