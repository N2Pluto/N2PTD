import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Link } from 'src/constants/Link'
import profileService from 'src/services/profile.service'
import { userStore } from 'src/stores/userStore'
import LoadingPage from './loadingpage'

interface LayoutProps {
  children?: React.ReactNode
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const { user, setUser, clearStore } = userStore()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!user) {
      checkAuth()
    }
  }, [user])

  const checkAuth = async () => {
    setLoading(true)

    const token = localStorage.getItem('accessToken')

    if (token) {
      const user = await profileService.fetchMe()
      if (user?.data) {
        setUser(user?.data)
        if (user?.data.role === 'admin') {
          router.push('/admin/userControl')
        } else if (user?.data.role === 'user') {
          clearStore()
          router.push(Link.HOME)
        } else {
          router.push(Link.HOME)
        }
      } else {
        router.push(Link.HOME)
      }
    } else {
      router.push(Link.HOME)
    }

    setLoading(false)
  }

  return (
    <React.Fragment>
      {loading ? <LoadingPage></LoadingPage> : <React.Fragment>{children}</React.Fragment>}
    </React.Fragment>
  )
}

export default AdminLayout
