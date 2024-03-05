//api/reservation/checkUserReservBed.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { bed_id } = req.query
  console.log('bed_id:', bed_id)

  const { data, error } = await supabase
    .from('Reservation')
    .select(
      `
      user_id,
      Users (*)
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
