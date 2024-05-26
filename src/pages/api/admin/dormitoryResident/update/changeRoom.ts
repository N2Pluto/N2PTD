// /api/admin/dormitoryResident/update/changeRoom.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
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
  console.log(
    `Updating Dormitory_Resident with dorm_id: ${newBuilding}, room_id: ${newRoom}, bed_id: ${newBed} for user_id: ${userId}`
  )
  const { error: updateError } = await supabase
    .from('Dormitory_Resident')
    .update({ dorm_id: newBuilding, room_id: newRoom, bed_id: newBed })
    .eq('user_id', userId)

  if (updateError) {
    console.error(updateError)
    res.status(500).json({ error: updateError.message })

    return
  }

  // Update Reservation_Approve
  console.log(
    `Updating Dormitory_Approve with dorm_id: ${newBuilding}, room_id: ${newRoom}, bed_id: ${newBed} for user_id: ${userId}`
  )
  const { error: approveError } = await supabase
    .from('Dormitory_Approve')
    .update({ dorm_id: newBuilding, room_id: newRoom, bed_id: newBed })
    .eq('user_id', userId)

  if (approveError) {
    console.error(approveError)
    res.status(500).json({ error: approveError.message })

    return
  }

  // Update Reservation
  console.log(
    `Updating Reservation with dorm_id: ${newBuilding}, room_id: ${newRoom}, bed_id: ${newBed} for user_id: ${userId}`
  )
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
