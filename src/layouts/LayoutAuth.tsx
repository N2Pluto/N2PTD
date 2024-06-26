import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Link } from 'src/constants/Link'
import profileService from 'src/services/profile.service'
import { userStore } from 'src/stores/userStore'
import Loading from './loadingpage'

interface LayoutProps {
  children?: React.ReactNode
}

const LayoutAuth: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const { user, setUser } = userStore()
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
      } else {
        router.push(Link.HOME)
      }
    } else {
      router.push(Link.HOME)
    }

    setLoading(false)
  }

  return <React.Fragment>{loading ? <Loading></Loading> : <React.Fragment>{children}</React.Fragment>}</React.Fragment>
}

export default LayoutAuth
