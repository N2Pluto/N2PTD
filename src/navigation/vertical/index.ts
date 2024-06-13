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
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings'
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges'
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
        icon: FeedOutlinedIcon,
        path: '/admin/dormitoryResident'
      },
      {
        title: 'ข้อมูลผู้ใช้',
        icon: DnsOutlinedIcon,
        path: '/admin/userManagement'
      },
       {
        sectionTitle: 'Import Student'
      },
      {
        title: 'นำเข้ารายชื่อนักศึกษา',
        icon: AccountPlusOutline,
        path: '/admin/importStudent'
      },
      {
        sectionTitle: 'การอนุมัติ'
      },
      {
        title: 'อนุมัติการจอง ',
        icon: CheckBoxOutlinedIcon,
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
      },

      {
        sectionTitle: 'การสร้าง'
      },
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
      },
      {
        sectionTitle: 'ควบคุม'
      },

      {
        title: 'การควบคุมตึก',
        icon: CorporateFareOutlinedIcon,
        path: '/admin/buildingControl'
      },
      {
        title: 'สร้างตึก',
        icon: DomainAddOutlinedIcon,
        path: '/admin/building'
      },

      // {
      //   title: 'เปลี่ยน Role',
      //   icon: PublishedWithChangesIcon,
      //   path: '/admin/userControl'
      // },

      {
        sectionTitle: 'แบบฟอร์ม'
      },
      {
        title: 'แบบฟอร์มคำร้องผู้ใช้',
        icon: ManageAccountsIcon,
        path: '/admin/userManagementForm'
      },
      {
        title: 'แบบฟอร์มย้ายห้อง',
        icon: ChangeCircleIcon,
        path: '/admin/dormitoryResident/changeRoomForm'
      },
      {
        title: 'แบบฟอร์มสลับห้อง',
        icon: DisplaySettingsIcon,
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
      },
      {
        title: 'Request Form',
        icon: HomeOutline,
        path: '/userGoogleForm'
      }
    ]
  }
}

export default useNavigation
