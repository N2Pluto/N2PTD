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
          console.log('admin')
          setRoleFilter('admin')
        } else if (data.userData.role === 'user') {
          console.log('user')
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
        title: 'discord',
        icon: HomeOutline,
        path: '/admin/discord'
      },
      {
        title: 'User information',
        icon: HomeOutline,
        path: '/admin/userControl'
      },
      {
        title: 'User',
        icon: HomeOutline,
        path: '/admin/userManagement'
      },
      {
        title: 'Building Control ',
        icon: HomeOutline,
        path: '/admin/buildingControl'
      },
      {
        title: 'Building',
        icon: HomeOutline,
        path: '/admin/building'
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
      // {
      //   title: 'Home',
      //   icon: HomeOutline,
      //   path: '/dashboard'
      // },

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



      // {
      //   sectionTitle: 'Pages'
      // },

      // {
      //   title: 'Dashboard',
      //   icon: HomeOutline,
      //   path: '/dashboard'
      // },

      // {
      //   title: 'Login',
      //   icon: Login,
      //   path: '/pages/login',
      //   // openInNewTab: true
      // },
      // {
      //   title: 'Account Settings',
      //   icon: AccountCogOutline,
      //   path: '/account-settings'
      // },

      // {
      //   title: 'Register',
      //   icon: AccountPlusOutline,
      //   path: '/pages/register',
      //   // openInNewTab: true
      // },
      // {
      //   title: 'Error',
      //   icon: AlertCircleOutline,
      //   path: '/pages/error',
      //   openInNewTab: true
      // },
      // {
      //   sectionTitle: 'User Interface'
      // },
      // {
      //   title: 'Typography',
      //   icon: FormatLetterCase,
      //   path: '/typography'
      // },
      // {
      //   title: 'Icons',
      //   path: '/icons',
      //   icon: GoogleCirclesExtended
      // },
      // {
      //   title: 'Cards',
      //   icon: CreditCardOutline,
      //   path: '/cards'
      // },
      // {
      //   title: 'Tables',
      //   icon: Table,
      //   path: '/tables'
      // },
      // {
      //   icon: CubeOutline,
      //   title: 'Form Layouts',
      //   path: '/form-layouts'
      // }
    ]
  }
}

export default useNavigation
