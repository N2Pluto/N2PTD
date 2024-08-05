import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { user_id } = req.query

  // Existing query for Reservation details
  const { data: reservationData, error: reservationError } = await supabase
    .from('Reservation')
    .select(
      `
        dorm_id,
        user_id,
        room_id,
        bed_id,
        round_id,
        status,
        payment_status,
        Dormitory_Building (name),
        Dormitory_Room (room_number),
        Dormitory_Bed (bed_number),
        Reservation_System (round_name)
      `
    )
    .eq('user_id', user_id)

  // New query for Users_Info details
  const { data: userInfoData, error: userInfoError } = await supabase
    .from('Users_Info')
    .select('name, lastname')
    .eq('user_id', user_id)

  if (reservationError || userInfoError) {
    res.status(500).json({ error: reservationError?.message || userInfoError?.message })
  } else {
    res.status(200).json({ reservationData, userInfoData })
  }
}

export default handler
