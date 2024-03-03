// ** Icon imports
import Login from 'mdi-material-ui/Login'
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
        });
        const data = await response.json();

        // เปลี่ยนไปใช้ data ที่ได้จากการ fetch โดยตรง
        console.log('', data.data.role);

        if (data.data.role === 'admin') {
          console.log('admin');
          setRoleFilter('admin');
        }




      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user?.user_id) {
      fetchUserProfile();
    }
  }, [user]);





  console.log('user',user)

  if(roleFilter === 'admin'){
    return [
      {
        title: 'Dashboard',
        icon: HomeOutline,
        path: '/admin/dashboardadmin'
      },
      {
        title: 'USER CONTROL',
        icon: HomeOutline,
        path: '/admin/userControl'
      },

    ]
  }else{
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

      // {
      //   title: 'Reservation Detail',
      //   icon: HomeOutline,
      //   path: '/reservation-detail/building/'
      // },

      // {
      //   title: 'Billing',
      //   icon: HomeOutline,
      //   path: '/Billing'
      // },
      // {
      //   title: 'Electricity Regression',
      //   icon: HomeOutline,
      //   path: '/Regression'
      // },
      {
        title: 'Profile',
        icon: HomeOutline,
        path: '/profile'
      },

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
      {
        sectionTitle: 'User Interface'
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

  }


}

export default useNavigation
