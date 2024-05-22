import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Link } from 'src/constants/Link'
import profileService from 'src/services/profile.service'
import { userStore } from 'src/stores/userStore'
import LoadingPage from './loadingpage'
import e from 'express'

interface LayoutProps {
  children?: React.ReactNode
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const { user, setUser } = userStore()
  const [loading, setLoading] = useState<boolean>(false)

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

  useEffect(() => {
    if (!user) {
      checkAuth()
    }
  })

  const checkAuth = async () => {
    setLoading(true)

    const token = localStorage.getItem('accessToken')

    if (token) {
      const user = await profileService.fetchMe()
      if (user?.data) {
        setUser(user?.data)
        if (user?.data.role != 'admin') {
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
