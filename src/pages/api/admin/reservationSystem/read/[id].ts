//this is /api/admin/reservationSystem/read/[id].ts


import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.query

  const { data, error } = await supabase.from('Reservation_System').select('*').eq('id', id)

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.status(200).json({ data: data[0] })
}

export default handler
