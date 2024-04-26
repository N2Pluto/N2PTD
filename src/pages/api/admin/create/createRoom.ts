// this is /api/admin/create/createRoom.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { data, error } = await supabase.from('Dormitory_Room').insert([
    {
      dorm_id: req.body.dorm_id,
      room_number: req.body.room_number,
      bed_capacity: req.body.bed_capacity
    }
  ])

  if (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  } else {
    // Fetch the newly created room's data
    const { data: roomData, error: roomError } = await supabase
      .from('Dormitory_Room')
      .select('*')
      .eq('room_number', req.body.room_number)
      .eq('dorm_id', req.body.dorm_id)
      .single()

    if (roomError) {
      console.error(roomError)
      res.status(500).json({ error: roomError.message })
    } else {
      res.status(200).json({ data: roomData })
    }
  }
}

export default handler
