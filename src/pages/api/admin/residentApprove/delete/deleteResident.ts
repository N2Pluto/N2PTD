// this is /api/admin/residentApprove/delete/deleteResident.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.body
  console.log('id', id)

  // Delete the record from Reservation
  const { error: deleteReservationError } = await supabase.from('Reservation').delete().eq('id', id)

  if (deleteReservationError) {
    console.error('Error deleting from Reservation:', deleteReservationError)
    res.status(500).json({ error: 'Failed to delete from Reservation' })
    return
  }

  res.status(200).json({ message: 'Reservation deleted successfully' })
}

export default handler
