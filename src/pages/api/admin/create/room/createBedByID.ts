//this is /api/admin/create/room/createBedByID.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { dorm_id, bed_capacity } = req.body
  console.log('Dorm ID:', dorm_id)
  console.log('Bed capacity:', bed_capacity)

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

  // Get the latest room_id for the given dorm_id
  const { data: roomData, error: roomError } = await supabase
    .from('Dormitory_Room')
    .select('room_id')
    .eq('dorm_id', dorm_id)
    .order('room_id', { ascending: false })
    .limit(1)
  if (roomError || !roomData || roomData.length === 0) {
    console.error('No rooms found for dorm_id:', dorm_id)
    res.status(400).json({ error: 'No rooms found for the given dorm_id' })
    return
  }

  const room_id = roomData[0].room_id
  console.log('Room ID:', room_id)

  const beds = Array.from({ length: bed_capacity }, (_, i) => ({
    room_id,
    bed_number: i + 1
  }))
  console.log('Beds:', beds)

  const { data, error } = await supabase.from('Dormitory_Bed').insert(beds)
  console.log('Data:', data)
  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  console.log('New beds:', data)
  res.status(200).json({ message: 'Beds created successfully' })
}

export default handler