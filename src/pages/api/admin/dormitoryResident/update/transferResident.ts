// /api/admin/dormitoryResident/update/transferResident.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id1, id2 } = req.body

  // Fetch the user_id for both selected IDs
  const { data: resident1, error: error1 } = await supabase
    .from('Dormitory_Resident')
    .select('user_id')
    .eq('id', id1)
    .single()

  const { data: resident2, error: error2 } = await supabase
    .from('Dormitory_Resident')
    .select('user_id')
    .eq('id', id2)
    .single()

  if (error1 || error2) {
    return res.status(500).json({ error: error1 || error2 })
  }

  // Update each record with the other's user_id in Dormitory_Resident table
  const { error: updateError1 } = await supabase
    .from('Dormitory_Resident')
    .update({ user_id: resident2.user_id })
    .eq('id', id1)

  const { error: updateError2 } = await supabase
    .from('Dormitory_Resident')
    .update({ user_id: resident1.user_id })
    .eq('id', id2)

  if (updateError1 || updateError2) {
    return res.status(500).json({ error: updateError1 || updateError2 })
  }

  // Fetch all reservations of both residents
  const { data: reservations1, error: reservationsError1 } = await supabase
    .from('Reservation')
    .select('*')
    .eq('user_id', resident1.user_id)

  const { data: reservations2, error: reservationsError2 } = await supabase
    .from('Reservation')
    .select('*')
    .eq('user_id', resident2.user_id)

  if (reservationsError1 || reservationsError2) {
    return res.status(500).json({ error: reservationsError1 || reservationsError2 })
  }

  // Update each reservation of resident1 to resident2
  for (let reservation of reservations1) {
    const { error: updateError } = await supabase
      .from('Reservation')
      .update({ user_id: resident2.user_id })
      .eq('id', reservation.id)

    if (updateError) {
      return res.status(500).json({ error: updateError })
    }
  }

  // Update each reservation of resident2 to resident1
  for (let reservation of reservations2) {
    const { error: updateError } = await supabase
      .from('Reservation')
      .update({ user_id: resident1.user_id })
      .eq('id', reservation.id)

    if (updateError) {
      return res.status(500).json({ error: updateError })
    }
  }

  // Return a success response
  return res.status(200).json({ message: 'Successfully swapped residents' })
}

export default handler
