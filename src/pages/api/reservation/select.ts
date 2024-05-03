import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { user_id } = req.query

  const { data, error } = await supabase
    .from('Reservation')
    .select(
      `
        dorm_id,
        user_id,
        room_id,
        bed_id,
        round_id,
        status,
        Dormitory_Building (name),
        Dormitory_Room (room_number),
        Dormitory_Bed (bed_number)
      `
    )
    .eq('user_id', user_id)

  if (error) {
    res.status(500).json({ error: error.message })
  } else {
    res.status(200).json({ data })
  }
}

export default handler
