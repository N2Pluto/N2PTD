// ** Icon imports
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
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
        title: 'Home',
        icon: HomeOutline,
        path: '/admin/home'
      },
      {
        title: 'dashboard',
        icon: HomeOutline,
        path: '/admin/dashboard'
      },
      {
        sectionTitle: 'ศูนย์รวมข้อมูล'
      },
      {
        title: 'ข้อมูลผู้อยู่อาศัย',
        icon: HomeOutline,
        path: '/admin/dormitoryResident'
      },
      {
        title: 'ข้อมูลผู้ใช้',
        icon: HomeOutline,
        path: '/admin/userManagement'
      },
      {
        sectionTitle: 'การอนุมัติ'
      },
      {
        title: 'อนุมัติผู้อยู่อาศัย',
        icon: HomeOutline,
        path: '/admin/residentApprove'
      },
      {
        title: 'อนุมัติการจอง ',
        icon: HomeOutline,
        path: '/admin/reservationApprove'
      },
      {
        sectionTitle: 'ควบคุม'
      },
      {
        title: 'การควบคุมตึก',
        icon: HomeOutline,
        path: '/admin/buildingControl'
      },
      {
        title: 'สร้างตึก',
        icon: HomeOutline,
        path: '/admin/building'
      },
      {
        title: 'รอบการจอง',
        icon: HomeOutline,
        path: '/admin/reservationSystem'
      },

      {
        title: 'เปลี่ยน Role',
        icon: HomeOutline,
        path: '/admin/userControl'
      },

      {
        sectionTitle: 'แบบฟอร์ม'
      },
      {
        title: 'แบบฟอร์มคำร้องผู้ใช้',
        icon: HomeOutline,
        path: '/admin/userManagementForm'
      },
      {
        title: 'แบบฟอร์มย้ายห้อง',
        icon: HomeOutline,
        path: '/admin/dormitoryResident/changeRoomForm'
      },
      {
        title: 'แบบฟอร์มสลับห้อง',
        icon: HomeOutline,
        path: '/admin/dormitoryResident/transferRoomForm'
      },
      {
        sectionTitle: 'User Interface'
      },
      {
        title: 'Home',
        icon: HomeOutline,
        path: '/dashboard'
      },
      {
        title: 'Typography',
        icon: FormatLetterCase,
        path: '/typography'
      },
      {
        title: 'Icons',
        path: '/icons',
        icon: GoogleCirclesExtended
      },
      {
        title: 'Cards',
        icon: CreditCardOutline,
        path: '/cards'
      },
      {
        title: 'Tables',
        icon: Table,
        path: '/tables'
      },
      {
        icon: CubeOutline,
        title: 'Form Layouts',
        path: '/form-layouts'
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
        icon: HomeOutline,
        path: '/Dormitory'
      },

      {
        title: 'Reservation',
        icon: HomeOutline,
        path: '/reservation'
      },

      {
        title: 'Profile',
        icon: HomeOutline,
        path: '/profile'
      }
    ]
  }
}

export default useNavigation
