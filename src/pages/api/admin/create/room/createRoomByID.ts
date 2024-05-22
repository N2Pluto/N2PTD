// /api/admin/create/room/createRoomByID.ts
import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })

    return
  }
  const { dorm_id, room_number, bed_capacity } = req.body


  // Check if the dorm_id exists in the Dormitory_Building table
  const { data: dormData, error: dormError } = await supabase
    .from('Dormitory_Building')
    .select('dorm_id')
    .eq('dorm_id', dorm_id)
  if (dormError || !dormData || dormData.length === 0) {
    console.error('Invalid dorm_id:', dorm_id)
    res.status(400).json({ error: 'Invalid dorm_id' })

    return
  }


  try {
    const { data, error, status } = await supabase
      .from('Dormitory_Room')
      .insert([{ dorm_id, room_number, bed_capacity }])
      
    if (error) {
      console.error('Error while inserting data:', error.message)
      res.status(500).json({ error: error.message })
      return
    }

    if (status === 201) {
      // The insert operation was successful
      res.status(200).json({ message: 'Room created successfully' })
    } else {
      console.error('Unexpected response from Supabase')
      res.status(500).json({ error: 'Unexpected response from Supabase' })
    }
  } catch (err) {
    console.error('Error while inserting data:', err)
    res.status(500).json({ error: err.message, details: err.details })
  }
}

export default handler
