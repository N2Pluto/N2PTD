import supabase from 'src/libs/supabase'

const handler = async (req, res) => {
  try {
    // Fetching buildings
    const { data: buildings, error: buildingError } = await supabase
      .from('Dormitory_Building')
      .select('name, dorm_id')
      .order('dorm_id', { ascending: true })

    if (buildingError) {
      throw new Error(`Error fetching buildings: ${buildingError.message}`)
    }

    // Fetching rooms and counting beds in parallel
    const fetchRoomsAndCountBeds = buildings.map(async building => {
      try {
        // Count rooms for each building
        const { data: roomsCount, error: roomCountError } = await supabase
          .from('Dormitory_Room')
          .select('room_id', { count: 'exact' })
          .eq('dorm_id', building.dorm_id)

        if (roomCountError) {
          throw new Error(`Error counting rooms for building ${building.dorm_id}: ${roomCountError.message}`)
        }

        // Fetch rooms to count beds within each room
        const { data: rooms, error: roomError } = await supabase
          .from('Dormitory_Room')
          .select('room_id')
          .eq('dorm_id', building.dorm_id)

        if (roomError) {
          throw new Error(`Error fetching rooms for building ${building.dorm_id}: ${roomError.message}`)
        }

        // Initialize counts
        let totalBeds = 0
        let reservedBeds = 0

        // Count beds for each room and aggregate
        for (const room of rooms) {
          try {
            // Count total beds
            const { count: totalBedsCount, error: totalBedCountError } = await supabase
              .from('Dormitory_Bed')
              .select('bed_id', { count: 'exact' })
              .eq('room_id', room.room_id)

            if (totalBedCountError) {
              throw new Error(`Error counting total beds for room ${room.room_id}: ${totalBedCountError.message}`)
            }

            // Count reserved beds
            const { count: reservedBedsCount, error: reservedBedCountError } = await supabase
              .from('Dormitory_Bed')
              .select('bed_id', { count: 'exact' })
              .eq('room_id', room.room_id)
              .eq('bed_status', false)

            if (reservedBedCountError) {
              throw new Error(`Error counting reserved beds for room ${room.room_id}: ${reservedBedCountError.message}`)
            }

            totalBeds += totalBedsCount
            reservedBeds += reservedBedsCount
          } catch (error) {
            console.error(error.message)
            throw error
          }
        }

        return { ...building, roomsCount: roomsCount.count, totalBeds, reservedBeds }
      } catch (error) {
        console.error(error.message)
        throw error
      }
    })

    const result = await Promise.all(fetchRoomsAndCountBeds)

    return res.status(200).json({ result })
  } catch (error) {
    console.error('Error in handler:', error.message)
    return res.status(500).json({ error: error.message })
  }
}

export default handler
