// /api/admin/dormitoryResident/read/fetchDormitoryData.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { data: newBuilding, error: buildingError } = await supabase
    .from('Dormitory_Building')
    .select('name,dorm_id')
    .order('dorm_id', { ascending: true })

  const dorm_id = newBuilding[0].dorm_id

  const { data: newRoom, error: roomError } = await supabase
    .from('Dormitory_Room')
    .select('room_number,room_id,status')
    .eq('dorm_id', dorm_id)
    .eq('status', true)
    .order('room_id', { ascending: true })

  const room_id = newRoom[0].room_id

  const { data: newBed, error: bedError } = await supabase
    .from('Dormitory_Bed')
    .select('bed_number,bed_id,bed_status')
    .eq('room_id', room_id)
    .order('bed_id', { ascending: true })

  if (buildingError || roomError || bedError) {
    return res.status(500).json({ error: buildingError || roomError || bedError })
  }

  return res.status(200).json({ newBuilding, newRoom, newBed })
}

export default handler
