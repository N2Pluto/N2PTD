
import supabase from 'src/libs/supabase'

export default async function handler(req: any, res: any) {
  const { room_id } = req.query

  try {
    // Assuming you have a 'reservations', 'Users_Information', and 'Users_Req' table in your database
    const { data: reservationData, error: reservationError } = await supabase
      .from('Reservation')
      .select('*, Users (*)')
      .eq('room_id', room_id)

    if (reservationError) {
      throw reservationError
    }

    const userIds = reservationData.map(reservation => reservation.user_id)

    const { data: usersInfoData, error: usersInfoError } = await supabase
      .from('Users_Info')
      .select('*')
      .in('user_id', userIds)

    if (usersInfoError) {
      throw usersInfoError
    }

    const { data: usersReqData, error: usersReqError } = await supabase
      .from('Users_Req')
      .select('*')
      .in('user_id', userIds)

    if (usersReqError) {
      throw usersReqError
    }

    // Merge the data as needed
    const data = reservationData.map(reservation => ({
      Reservation_Info: reservation,
      Users_Info: usersInfoData.find(userInfo => userInfo.user_id === reservation.user_id),
      Users_Req: usersReqData.find(userReq => userReq.user_id === reservation.user_id)
    }))

    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching reservation data:', error.message)
    res.status(500).json({ error: 'Error fetching reservation data' })
  }
}
