import router from 'next/router'
import { Link } from 'src/constants/Link'

const reserMe = async () => {
  const token = localStorage.getItem('accessToken')

  try {
    console.log('token2', token)
    const response = await fetch(`/api/reservation/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const jsonData = await response.json()

    return jsonData
  } catch (error) {
    router.push(Link.HOME)
  }
}


const reservationSrevice = { reserMe}

export default reservationSrevice
