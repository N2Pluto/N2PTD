const fetchMe = async () => {
  const token = localStorage.getItem('accessToken')

  try {
    const response = await fetch(`/api/profile/me`, {
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
  } catch (error) {}
}

const profileService = { fetchMe }

export default profileService
