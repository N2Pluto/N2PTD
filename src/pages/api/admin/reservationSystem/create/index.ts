// this is /api/admin/reservationSystem/create

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  console.log('req.body:', req.body)
  const { round_name, start_date, end_date, student_year } = req.body

  // Fetch existing rounds for the selected year
  const { data: existingRounds, error: fetchError } = await supabase
    .from('Reservation_System')
    .select('round_name')
    .ilike('round_name', `${round_name}%`)

  if (fetchError) {
    console.error('Error fetching data:', fetchError)
    return res.status(500).json({ error: 'Error fetching data' })
  }

  // Find the maximum round number
  const maxRoundNumber = existingRounds.reduce((max, round) => {
    const roundNumber = parseInt(round.round_name.split(' ')[2])
    return roundNumber > max ? roundNumber : max
  }, 0)

  // Increment the round number for the new round
  const newRoundName = `${round_name} Phase ${maxRoundNumber + 1}`

  const { error: insertError } = await supabase
    .from('Reservation_System')
    .insert([{ round_name: newRoundName, start_date, end_date, student_year }])

  if (insertError) {
    console.error('Error inserting data:', insertError)
    return res.status(500).json({ error: 'Error inserting data' })
  }

  return res.status(200).json({ message: 'Data inserted successfully' })
}

export default handler