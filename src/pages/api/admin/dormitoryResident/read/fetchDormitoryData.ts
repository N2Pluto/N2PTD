// /api/admin/dormitoryResident/read/fetchDormitoryData.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    // Fetching buildings
    const { data: buildings, error: buildingError } = await supabase
      .from('Dormitory_Building')
      .select('name, dorm_id')
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
