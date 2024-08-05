//this is /api/reservation/checkReservation

import supabase from 'src/libs/supabase'


const handler = async (req : any, res : any) => {
  const { user_id } = req.query

  const { data: existingReservations, error } = await supabase.from('Reservation').select('*').eq('user_id', user_id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  if (existingReservations && existingReservations.length > 0) {
    return res.status(200).json({ hasReservation: true })
  }

  return res.status(200).json({ hasReservation: false })
}

export default handler
