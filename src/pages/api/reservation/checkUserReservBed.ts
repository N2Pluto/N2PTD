//api/reservation/checkUserReservBed.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { bed_id } = req.query

  const { data, error } = await supabase
    .from('Reservation')
    .select(
      `
    user_id,
    Users (
      *,
      Users_Info (*),
      Users_Req (*)
    )
    `
    )
    .eq('bed_id', bed_id)

  if (error) {
    res.status(500).json({ error: error.message })
    console.error('Error:', error.message)
  } else {
    res.status(200).json({ data })
  }
}

export default handler
