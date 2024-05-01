// this is /api/admin/reservationSystem/create/checkDuplicateDate

import supabase from 'src/libs/supabase'


const handler = async (req: any, res: any) => {
  const { start_date, end_date } = req.body

  // Check if there is already a reservation with round_status == true
  const { data: activeRoundData, error: activeRoundError } = await supabase
    .from('Reservation_System')
    .select('*')
    .eq('round_status', true)

  if (activeRoundError) {
    console.error('Error checking active round:', activeRoundError)
    res.status(500).json({ error: 'Failed to check active round' })

    return
  }

  if (activeRoundData.length > 0) {
    res.status(400).json({ error: 'A round is already active.' })
    
    return
  }

  // Check for duplicate dates
  const { data, error } = await supabase
    .from('Reservation_System')
    .select('*')
    .gte('start_date', start_date)
    .lte('end_date', end_date)

  if (error) {
    console.error('Error checking duplicate dates:', error)
    res.status(500).json({ error: 'Failed to check duplicate dates' })

    return
  }

  if (data.length > 0) {
    res.status(200).json({ isDuplicate: true })
  } else {
    res.status(200).json({ isDuplicate: false })
  }
}

export default handler
