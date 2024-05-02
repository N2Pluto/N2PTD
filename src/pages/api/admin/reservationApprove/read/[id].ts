// File: /pages/api/admin/reservationApprove/read/[id].ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.query // Extract the round ID from the request query

  const { data: reservationData, error: reservationError } = await supabase
    .from('Reservation')
    .select(
      '*,Dormitory_Building(name),Dormitory_Room(room_number),Dormitory_Bed(bed_number),Reservation_System(round_name)'
    )
    .eq('round_id', id) // Filter reservations by round ID

  if (reservationError) return res.status(500).json({ error: reservationError.message })

  const { data: usersInfoData, error: usersInfoError } = await supabase.from('Users_Info').select('*')

  if (usersInfoError) return res.status(500).json({ error: usersInfoError.message })

  const data = reservationData.map(reservation => {
    const userInfo = usersInfoData.find(user => user.user_id === reservation.user_id)
    return { ...reservation, Users_Info: userInfo }
  })

  return res.status(200).json(data)
}

export default handler
