const fetchBuilding = async () => {
    const token = localStorage.getItem('accessToken')

    try {
        const response = await fetch(`/api/fetch_building`, {
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

const buildingService = { fetchBuilding }

export default buildingService
