// this is /api/admin/reservationSystem/create

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
    console.log('req.body:', req.body)
  const { round_name, start_date, end_date, gender, student_year } = req.body

  const { error } = await supabase
    .from('Reservation_System')
    .insert([{ round_name, start_date, end_date, gender, student_year }])

  if (error) {
    console.error('Error inserting data:', error)

    return res.status(500).json({ error: 'Error inserting data' })
  }

  return res.status(200).json({ message: 'Data inserted successfully' })
}

export default handler
