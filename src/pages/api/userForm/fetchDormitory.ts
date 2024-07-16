// /api/userForm/fetchDormitory.ts

import supabase from 'src/libs/supabase'

const handler = async (req, res) => {
  try {
    const { user_id } = req.query

    // Fetch user's gender
    const { data: userInfo, error: userInfoError } = await supabase
      .from('Users_Info')
      .select('gender')
      .eq('user_id', user_id)
      .single()

    if (userInfoError) throw userInfoError

    // Fetch buildings that match the user's gender
    const { data: buildings, error: buildingError } = await supabase
      .from('Dormitory_Building')
      .select('name, dorm_id, type_gender')
      .eq('type_gender', userInfo.gender) // Filter by gender
      .order('dorm_id', { ascending: true })

    if (buildingError) {
      throw buildingError
    }

    // Fetching rooms and beds in parallel
    const fetchRoomsAndBeds = buildings.map(async building => {
      const { data: rooms, error: roomError } = await supabase
        .from('Dormitory_Room')
        .select('room_number, room_id, status')
        .eq('dorm_id', building.dorm_id)
        .eq('status', true)
        .order('room_id', { ascending: true })

      if (roomError) {
        throw roomError
      }

      // Fetch beds for each room
      const fetchBeds = rooms.map(async room => {
        const { data: beds, error: bedError } = await supabase
          .from('Dormitory_Bed')
          .select('bed_number, bed_id, bed_status')
          .eq('room_id', room.room_id)
          .eq('bed_status', true)
          .order('bed_id', { ascending: true })

        if (bedError) {
          throw bedError
        }

        return { ...room, beds }
      })

      const roomsWithBeds = await Promise.all(fetchBeds)

      return { ...building, rooms: roomsWithBeds }
    })

    const result = await Promise.all(fetchRoomsAndBeds)

    return res.status(200).json({ result })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export default handler
