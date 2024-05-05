// this is /api/admin/reservationSystem/create/createResident

import { NextApiRequest, NextApiResponse } from 'next'
import  supabase  from 'src/libs/supabase'

interface Resident {
  dorm_id: number
  room_id: number
  bed_id: number
  user_id: string
  round_id: number
  created_at: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const residents: Resident[] = req.body

    const { error } = await supabase.from('Dormitory_Resident').insert(residents)

    if (error) {
      console.error('Error inserting residents:', error)
      return res.status(500).json({ error: 'Failed to insert residents' })
    }

    return res.status(200).json({ message: 'Residents inserted successfully' })
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

export default handler
