// /api/userForm/update/[id].ts

import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user_id, id, ...updateFields } = req.body
    console.log(req.body)
    console.log('filteredRequest.user_id', user_id)

    // Check if user_id and id exist
    if (!user_id || !id) {
      return res.status(400).json({ error: 'user_id and id are required' })
    }

    // Extract individual fields for easy access
    const { newBuilding, newRoom, newBed } = updateFields

    // Update Dormitory_Resident and Reservation tables
    const { data: dormitoryResidentUpdate, error: dormitoryResidentError } = await supabase
      .from('Dormitory_Resident')
      .update({ dorm_id: newBuilding, room_id: newRoom, bed_id: newBed })
      .match({ user_id: user_id })

    if (dormitoryResidentError) throw dormitoryResidentError

    const { data: reservationUpdate, error: reservationError } = await supabase
      .from('Reservation')
      .update({ dorm_id: newBuilding, room_id: newRoom, bed_id: newBed })
      .match({ user_id: user_id })

    if (reservationError) throw reservationError

    // Update Form_ChangeRoom status to 'Approve'
    const { data: formChangeRoomUpdate, error: formChangeRoomError } = await supabase
      .from('Form_ChangeRoom')
      .update({ status: 'Approve' })
      .match({ id: id }) // Assuming 'id' is the correct identifier for Form_ChangeRoom

    if (formChangeRoomError) throw formChangeRoomError

    res
      .status(200)
      .json({ message: 'Update successful', dormitoryResidentUpdate, reservationUpdate, formChangeRoomUpdate })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while updating the profile' })
  }
}

export default handler
