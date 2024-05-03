// this is /api/admin/reservationApprove/update/updateApprove.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id, status } = req.body

  const { error } = await supabase.from('Reservation').update({ status }).eq('id', id)

  if (error) {
    console.error('Error updating reservation status:', error)
    res.status(500).json({ error: 'Failed to update reservation status' })
  } else {
    res.status(200).json({ message: 'Reservation status updated successfully' })
  }
}

export default handler
