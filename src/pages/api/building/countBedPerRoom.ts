//this is /api/building/countBedPerRoom
import supabase from 'src/libs/supabase'

const handler = async (req : any, res : any) => {
  try {
    // Fetching buildings
    const { data: buildings, error: buildingError } = await supabase
      .from('Dormitory_Building')
      .select('name, dorm_id')
      .order('dorm_id', { ascending: true })

    if (buildingError) {
      throw buildingError
    }

    // Fetching rooms and counting beds in parallel
    const fetchRoomsAndCountBeds = buildings.map(async building => {
      // Count rooms for each building
      const { data: roomsCount , error: roomCountError } = await supabase
        .from('Dormitory_Room')
        .select('room_id', { count: 'exact' })
        .eq('dorm_id', building.dorm_id)

      if (roomCountError) {
        throw roomCountError
      }

      // Fetch rooms to count beds within each room
      const { data: rooms, error: roomError } = await supabase
        .from('Dormitory_Room')
        .select('room_id')
        .eq('dorm_id', building.dorm_id)

      if (roomError) {
        throw roomError
      }

      // Initialize counts
      let totalBeds = 0
      let reservedBeds = 0

      // Count beds for each room and aggregate
      for (const room of rooms) {
        // Count total beds
        const { count: totalBedsCount, error: totalBedCountError } = await supabase
          .from('Dormitory_Bed')
          .select('bed_id', { count: 'exact' })
          .eq('room_id', room.room_id)

        if (totalBedCountError) {
          throw totalBedCountError
        }

        // Count reserved beds
        const { count: reservedBedsCount, error: reservedBedCountError } = await supabase
          .from('Dormitory_Bed')
          .select('bed_id', { count: 'exact' })
          .eq('room_id', room.room_id)
          .eq('bed_status', false)

        if (reservedBedCountError) {
          throw reservedBedCountError
        }

        totalBeds += totalBedsCount
        reservedBeds += reservedBedsCount
      }

      return { ...building, roomsCount: roomsCount, totalBeds, reservedBeds }
    })

    const result = await Promise.all(fetchRoomsAndCountBeds)

    return res.status(200).json({ result })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export default handler
