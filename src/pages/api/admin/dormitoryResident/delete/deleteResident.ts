// this is /api/admin/dormitoryResident/delete/deleteResident.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.body

  // Fetch the user_id of the resident to delete
  const { data: resident, error: fetchError } = await supabase.from('Dormitory_Resident').select('user_id').eq('id', id)

  if (fetchError) {
    console.error('Error fetching resident:', fetchError)
    return res.status(500).json({ error: 'Error fetching resident' })
  }

  const userId = resident[0].user_id

  // Delete the corresponding entries in the Reservation table
  const { error: deleteReservationError } = await supabase.from('Reservation').delete().eq('user_id', userId)

  if (deleteReservationError) {
    console.error('Error deleting reservation:', deleteReservationError)
    return res.status(500).json({ error: 'Error deleting reservation' })
  }

  // Delete the resident
  const { error: deleteResidentError } = await supabase.from('Dormitory_Resident').delete().eq('id', id)

  if (deleteResidentError) {
    console.error('Error deleting resident:', deleteResidentError)
    return res.status(500).json({ error: 'Error deleting resident' })
  }

  return res.status(200).json({ message: 'Resident, corresponding reservations, and approvals deleted successfully' })
}

export default handler
