// /api/admin/reservationSystem/read/fetchRoundStatus.ts
import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { data, error } = await supabase.from('Reservation_System').select('*')

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}

export default handler
