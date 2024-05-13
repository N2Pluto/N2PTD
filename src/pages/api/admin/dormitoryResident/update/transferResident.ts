// /api/admin/dormitoryResident/update/transferResident.ts

import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

  // Update each record with the other's user_id in Reservation table
  const { error: updateError3 } = await supabase
    .from('Reservation')
    .update({ user_id: resident2.user_id })
    .eq('user_id', resident1.user_id)

  const { error: updateError4 } = await supabase
    .from('Reservation')
    .update({ user_id: resident1.user_id })
    .eq('user_id', resident2.user_id)

  if (updateError1 || updateError2 || updateError3 || updateError4) {
    return res.status(500).json({ error: updateError1 || updateError2 || updateError3 || updateError4 })
  }

  // Return a success response
  return res.status(200).json({ message: 'Successfully swapped residents' })
}

export default handler
