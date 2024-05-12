// /api/admin/dormitoryResident/update/changeRoom.ts
import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { newBuilding, newRoom, newBed, id } = req.body

  // Fetch the user_id from Dormitory_Resident
  const { data: residentData, error: residentError } = await supabase
    .from('Dormitory_Resident')
    .select('user_id')
    .eq('id', id)

  if (residentError) {
    console.error(residentError)
    res.status(500).json({ error: residentError.message })
    return
  }

  const userId = residentData[0].user_id

  // Update Dormitory_Resident
  const { error: updateError } = await supabase
    .from('Dormitory_Resident')
    .update({ dorm_id: newBuilding, room_id: newRoom, bed_id: newBed })
    .eq('id', id)

  if (updateError) {
    console.error(updateError)
    res.status(500).json({ error: updateError.message })
    return
  }

  // Update Reservation
  const { error: reservationError } = await supabase
    .from('Reservation')
    .update({ dorm_id: newBuilding, room_id: newRoom, bed_id: newBed })
    .eq('user_id', userId)

  if (reservationError) {
    console.error(reservationError)
    res.status(500).json({ error: reservationError.message })
    return
  }

  res.status(200).json({ message: 'Update successful' })
}

export default handler
