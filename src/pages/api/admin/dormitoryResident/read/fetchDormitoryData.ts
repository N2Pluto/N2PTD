// /api/admin/dormitoryResident/read/fetchDormitoryData.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { data: newBuilding, error: buildingError } = await supabase
    .from('Dormitory_Building')
    .select('name,dorm_id')
    .order('dorm_id', { ascending: true })

  let result = []

  for (const building of newBuilding) {
    const dorm_id = building.dorm_id

    const { data: newRoom, error: roomError } = await supabase
      .from('Dormitory_Room')
      .select('room_number,room_id,status')
      .eq('dorm_id', dorm_id)
      .eq('status', true)
      .order('room_id', { ascending: true })

    let rooms = []

    for (const room of newRoom) {
      const room_id = room.room_id

      const { data: newBed, error: bedError } = await supabase
        .from('Dormitory_Bed')
        .select('bed_number,bed_id,bed_status')
        .eq('room_id', room_id)
        .eq('bed_status', true)
        .order('bed_id', { ascending: true })

      rooms.push({
        ...room,
        beds: newBed
      })
    }

    result.push({
      ...building,
      rooms: rooms
    })
  }

  if (buildingError) {
    return res.status(500).json({ error: buildingError })
  }

  return res.status(200).json({ result })
}

export default handler
