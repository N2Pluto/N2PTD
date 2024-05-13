// /api/admin/dormitoryResident/read/[id].ts

import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  const { data, error } = await supabase
    .from('Dormitory_Resident')
    .select(
      `
      *,
      Dormitory_Building: dorm_id (*),
      Dormitory_Room: room_id (*),
      Dormitory_Bed: bed_id (*) 
    `
    )
    .eq('id', id)
    .single()

  if (error) return res.status(500).json({ error: error.message })
    
  return res.status(200).json(data)
}

export default handler
