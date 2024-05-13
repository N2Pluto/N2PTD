//this is /api/admin/dormitoryResident/read/fetchResident.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { data, error } = await supabase
    .from('Dormitory_Resident')
    .select(
      `*,Dormitory_Building(name),Dormitory_Room(room_number),Dormitory_Bed(bed_number),Reservation_System(round_name),Users(*,Users_Info(*))`
    )
    .order('id', { ascending: true })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.status(200).json({ data })
}

export default handler
