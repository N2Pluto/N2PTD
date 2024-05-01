// this is /api/admin/delete/building/deleteBuildingByID.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { dorm_id } = req.body

  try {
    // Delete beds with matching room_id
    const { data: rooms, error: roomsError } = await supabase
      .from('Dormitory_Room')
      .select('room_id')
      .eq('dorm_id', dorm_id)

    if (roomsError) {
      console.error('Error fetching rooms:', roomsError.message)
      res.status(500).json({ error: roomsError.message })
      return
    }

    const roomIds = rooms.map(room => room.room_id)

    const { error: bedError } = await supabase.from('Dormitory_Bed').delete().in('room_id', roomIds)

    if (bedError) {
      console.error('Error deleting beds:', bedError.message)
      res.status(500).json({ error: bedError.message })
      return
    }

    // Delete rooms with matching dorm_id
    const { error: roomError } = await supabase.from('Dormitory_Room').delete().eq('dorm_id', dorm_id)

    if (roomError) {
      console.error('Error deleting rooms:', roomError.message)
      res.status(500).json({ error: roomError.message })
      return
    }

    // Delete the building
    const { error: buildingError } = await supabase.from('Dormitory_Building').delete().eq('dorm_id', dorm_id)

    if (buildingError) {
      console.error('Error deleting building:', buildingError.message)
      res.status(500).json({ error: buildingError.message })
      return
    }

    res.status(200).json({ message: 'Building, rooms, and associated beds deleted successfully' })
  } catch (error) {
    console.error('Error deleting building, rooms, and beds:', error)
    res.status(500).json({ error: error.message })
  }
}

export default handler
