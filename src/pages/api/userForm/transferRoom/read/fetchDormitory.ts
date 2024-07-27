// /api/userForm/transferRoom/read/fetchDormitory.ts

import supabase from 'src/libs/supabase'

const handler = async (req : any, res : any) => {
  try {
    const { user_id } = req.query

    // Fetch user's dorm_id from Dormitory_Resident
    const { data: residentInfo, error: residentError } = await supabase
      .from('Dormitory_Resident')
      .select('dorm_id')
      .eq('user_id', user_id)
      .single()

    if (residentError) throw residentError

    // Fetch the bed_id from Reservation table for the user_id
    const { data: reservationData, error: reservationError } = await supabase
      .from('Reservation')
      .select('bed_id')
      .eq('user_id', user_id)
      .single()

    if (reservationError) throw reservationError

    // Fetch buildings that match the dorm_id from Dormitory_Resident
    const { data: buildings, error: buildingError } = await supabase
      .from('Dormitory_Building')
      .select('name, dorm_id, type_gender')
      .eq('dorm_id', residentInfo.dorm_id)

    if (buildingError) {
      throw buildingError
    }

    // Fetching rooms and beds in parallel for the filtered building(s)
    const fetchRoomsAndBeds = buildings.map(async building => {
      const { data: rooms, error: roomError } = await supabase
        .from('Dormitory_Room')
        .select('room_number, room_id, status')
        .eq('dorm_id', building.dorm_id)
        .order('room_id', { ascending: true })

      if (roomError) {
        throw roomError
      }

      // Fetch beds for each room, excluding the bed_id from Reservation
      const fetchBeds = rooms.map(async room => {
        const { data: beds, error: bedError } = await supabase
          .from('Dormitory_Bed')
          .select('bed_number, bed_id, bed_status')
          .eq('room_id', room.room_id)
          .eq('bed_status', false)
          .not('bed_id', 'eq', reservationData?.bed_id) // Exclude the bed_id from Reservation
          .order('bed_id', { ascending: true })

        if (bedError) {
          throw bedError
        }

        return { ...room, beds }
      })

      const roomsWithBeds = await Promise.all(fetchBeds)
      // Filter out rooms that do not have any beds with bed_status = false
      const filteredRoomsWithBeds = roomsWithBeds.filter(room => room.beds.length > 0)

      return { ...building, rooms: filteredRoomsWithBeds }
    })

    const result = await Promise.all(fetchRoomsAndBeds)

    return res.status(200).json({ result })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export default handler
