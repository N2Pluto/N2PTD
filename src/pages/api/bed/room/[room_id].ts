// this is api/bed/room/[room_id].ts
import supabase from 'src/libs/supabase'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await supabase
    .from('Dormitory_Bed')
    .select(
      `
      *,
      Dormitory_Room(
        room_number,
        dorm_id,
        Dormitory_Building(name)
      )
    `
    )
    .eq('room_id', req.query.room_id)
    .order('bed_id', { ascending: true })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json({ data })
}

export default handler
