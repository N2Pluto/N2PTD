// this is /api/admin/residentApprove/delete/deleteResident.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.body

  // Fetch the record from Dormitory_Approve
  const { data, error: fetchError } = await supabase.from('Dormitory_Approve').select('user_id').eq('id', id)

  if (fetchError || !data || data.length === 0) {
    console.error('Error fetching Dormitory_Approve data:', fetchError)
    res.status(500).json({ error: 'Failed to fetch Dormitory_Approve data' })
    return
  }

  const userId = data[0].user_id

  // Fetch the record from Reservation
  const { data: reservationData, error: reservationError } = await supabase
    .from('Reservation')
    .select('id')
    .eq('user_id', userId)

  if (reservationError || !reservationData || reservationData.length === 0) {
    console.error('Error fetching Reservation data:', reservationError)
    res.status(500).json({ error: 'Failed to fetch Reservation data' })
    return
  }

  const reservationId = reservationData[0].id

  // Delete the record from Dormitory_Approve
  const { error: deleteApproveError } = await supabase.from('Dormitory_Approve').delete().eq('id', id)

  if (deleteApproveError) {
    console.error('Error deleting from Dormitory_Approve:', deleteApproveError)
    res.status(500).json({ error: 'Failed to delete from Dormitory_Approve' })
    return
  }

  // Delete the record from Reservation
  const { error: deleteReservationError } = await supabase.from('Reservation').delete().eq('id', reservationId)

  if (deleteReservationError) {
    console.error('Error deleting from Reservation:', deleteReservationError)
    res.status(500).json({ error: 'Failed to delete from Reservation' })
    return
  }

  res.status(200).json({ message: 'Reservation deleted successfully' })
}

export default handler