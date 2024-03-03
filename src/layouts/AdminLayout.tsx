import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Link } from 'src/constants/Link'
import profileService from 'src/services/profile.service'
import { userStore } from 'src/stores/userStore'

interface LayoutProps {
  children?: React.ReactNode
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const { user, setUser } = userStore()
  const [loading, setLoading] = useState<boolean>(false)
  const { clearStore } = userStore()

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
        }else{
          clearStore()
          router.push(Link.HOME)
        }


      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    if (user?.user_id) {
      fetchUserProfile();
    }
  }, [user]);




  useEffect(() => {
    if (!user) {
      checkAuth()
    }
  }, [user])



  const checkAuth = async () => {
    setLoading(true)

    const token = localStorage.getItem('accessToken')
    console.log('admintoken', token)

    if (token) {
      console.log('admintoken2', token)
      const user = await profileService.fetchMe()
      if (user?.data) {
        setUser(user?.data)
        console.log('asdadsad', user.data)

      } else {
        router.push(Link.HOME)
      }
    } else {

      router.push(Link.HOME)
    }

    setLoading(false)
  }

  return <React.Fragment>{loading ? <div>Loading</div> : <React.Fragment>{children}</React.Fragment>}</React.Fragment>
}

export default AdminLayout
