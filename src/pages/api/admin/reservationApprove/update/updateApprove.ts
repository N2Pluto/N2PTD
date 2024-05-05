// this is /api/admin/reservationApprove/update/updateApprove.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id, status } = req.body

  // If the status is 'Reject', delete the reservation
  if (status === 'Reject') {
    const { error } = await supabase.from('Reservation').delete().eq('id', id)

    if (error) {
      console.error('Error deleting reservation:', error)
      res.status(500).json({ error: 'Failed to delete reservation' })
      return
    }

    res.status(200).json({ message: 'Reservation deleted successfully' })
    return
  }

  // Update the reservation status
  const { error } = await supabase.from('Reservation').update({ status }).eq('id', id)

  if (error) {
    console.error('Error updating reservation status:', error)
    res.status(500).json({ error: 'Failed to update reservation status' })
    return
  }

  // If the status is 'Approve', get the updated reservation data and insert it into the 'Dormitory_Resident' table
  if (status === 'Approve') {
    const { data, error: fetchError } = await supabase.from('Reservation').select('*').eq('id', id)

    if (fetchError || !data || data.length === 0) {
      console.error('Error fetching updated reservation data:', fetchError)
      res.status(500).json({ error: 'Failed to fetch updated reservation data' })
      return
    }

    const { error: insertError } = await supabase.from('Dormitory_Resident').insert({
      dorm_id: data[0].dorm_id,
      room_id: data[0].room_id,
      bed_id: data[0].bed_id,
      user_id: data[0].user_id,
      round_id: data[0].round_id
    })

    if (insertError) {
      console.error('Error inserting reservation data into Dormitory_Resident:', insertError)
      res.status(500).json({ error: 'Failed to insert reservation data into Dormitory_Resident' })
      return
    }
  }

  res.status(200).json({ message: 'Reservation status updated successfully' })
}

export default handler
