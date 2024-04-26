// this is /api/admin/delete/room/deleteRoomByID.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    
    return
  }

  const { room_id } = req.body

  // Delete beds with matching room_id
  const { error: bedError } = await supabase.from('Dormitory_Bed').delete().eq('room_id', room_id)

  if (bedError) {
    console.error('Error deleting beds:', bedError.message)
    res.status(500).json({ error: bedError.message })

    return
  }

  // Delete the room
  const { error: roomError } = await supabase.from('Dormitory_Room').delete().eq('room_id', room_id)

  if (roomError) {
    console.error('Error deleting room:', roomError.message)
    res.status(500).json({ error: roomError.message })

    return
  }

  res.status(200).json({ message: 'Room and associated beds deleted successfully' })
}

export default handler