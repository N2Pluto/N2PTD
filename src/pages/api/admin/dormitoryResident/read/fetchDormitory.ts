//this is /api/admin/dormitoryResident/read/fetchDormitory.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { dorm_id, room_id } = req.query

  if (!dorm_id && !room_id) {
    // Fetch buildings if no dorm_id and room_id is provided
    const { data, error } = await supabase.from('Dormitory_Building').select('dorm_id, name')

    if (error) return res.status(500).json({ error: 'Error fetching buildings' })
    return res.status(200).json(data)
  }

  if (dorm_id) {
    // Fetch rooms if dorm_id is provided
    const { data, error } = await supabase
      .from('Dormitory_Room')
      .select('room_id, room_number')
      .eq('dorm_id', dorm_id)
      .eq('status', true)

    if (error) return res.status(500).json({ error: 'Error fetching rooms' })
    return res.status(200).json(data)
  }

  if (room_id) {
    // Fetch beds if room_id is provided
    const { data, error } = await supabase
      .from('Dormitory_Bed')
      .select('bed_id, bed_number')
      .eq('room_id', room_id)
      .eq('bed_status', true)

    if (error) return res.status(500).json({ error: 'Error fetching beds' })
    return res.status(200).json(data)
  }
}

export default handler
