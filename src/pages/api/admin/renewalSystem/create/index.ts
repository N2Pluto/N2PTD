// this is /api/admin/renewalSystem/create/index.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { userRenewal, residentData } = req.body
  console.log(req.body)

  if (!userRenewal || !residentData) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const { dorm_id, room_id, bed_id, user_id, round_id } = residentData

  try {
    const { data, error } = await supabase.from('Renewal_Dormitory').update({ status: userRenewal }).match({
      dorm_id,
      room_id,
      bed_id,
      user_id,
      round_id
    })

    if (error) {
      throw error
    }

    res.status(200).json({ data })
  } catch (error) {
    console.error('Error updating data:', error)
    res.status(500).json({ error: 'Failed to update data' })
  }
}

export default handler
