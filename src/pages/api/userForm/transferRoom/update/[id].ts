// /api/userForm/transferRoom/update/[id].ts

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

    // Find the current room details of the user_id in Dormitory_Resident
    const { data: currentUserRoomData, error: currentUserRoomError } = await supabase
      .from('Dormitory_Resident')
      .select('*')
      .match({ user_id: user_id })

    if (currentUserRoomError) throw currentUserRoomError
    if (currentUserRoomData.length === 0) {
      return res.status(404).json({ error: 'No current Dormitory_Resident found for the user_id' })
    }

    // Find the target room details in Dormitory_Resident
    const { data: targetRoomData, error: targetRoomError } = await supabase
      .from('Dormitory_Resident')
      .select('*')
      .match({ dorm_id: newBuilding, room_id: newRoom, bed_id: newBed })

    if (targetRoomError) throw targetRoomError
    if (targetRoomData.length === 0) {
      return res.status(404).json({ error: 'No target Dormitory_Resident found for the new room details' })
    }

    // Swap logic for Dormitory_Resident
    await supabase
      .from('Dormitory_Resident')
      .update({
        dorm_id: targetRoomData[0].dorm_id,
        room_id: targetRoomData[0].room_id,
        bed_id: targetRoomData[0].bed_id,
        round_id: targetRoomData[0].round_id
      })
      .match({ user_id: user_id })

    await supabase
      .from('Dormitory_Resident')
      .update({
        dorm_id: currentUserRoomData[0].dorm_id,
        room_id: currentUserRoomData[0].room_id,
        bed_id: currentUserRoomData[0].bed_id,
        round_id: currentUserRoomData[0].round_id
      })
      .match({ user_id: targetRoomData[0].user_id })

    // Swap logic for Reservation
    await supabase
      .from('Reservation')
      .update({
        dorm_id: targetRoomData[0].dorm_id,
        room_id: targetRoomData[0].room_id,
        bed_id: targetRoomData[0].bed_id
      })
      .match({ user_id: user_id })

    await supabase
      .from('Reservation')
      .update({
        dorm_id: currentUserRoomData[0].dorm_id,
        room_id: currentUserRoomData[0].room_id,
        bed_id: currentUserRoomData[0].bed_id
      })
      .match({ user_id: targetRoomData[0].user_id })

    // Update Form_TransferRoom status to 'Approve' after successful swap
    const { error: updateFormError } = await supabase
      .from('Form_TransferRoom')
      .update({ status: 'Approve' })
      .match({ id: id })

    if (updateFormError) throw updateFormError

    res.status(200).json({
      message: 'Room transfer completed successfully, and transfer form status updated to Approve',
      swappedFromUserId: user_id,
      swappedToUserId: targetRoomData[0].user_id
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred during the room transfer process' })
  }
}

export default handler
