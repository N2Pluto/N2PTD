// this is /api/admin/reservationSystem/create/checkDuplicateDate

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { start_date, end_date } = req.body

  // Fetch all records from the database
  const { data: allRecords, error: fetchError } = await supabase.from('Reservation_System').select('*')

  if (fetchError) {
    console.error('Error fetching records:', fetchError)
    res.status(500).json({ error: 'Failed to fetch records' })

    return
  }

  const start = new Date(start_date)
  start.setHours(0, 0, 0, 0) // Strip off time part

  const end = new Date(end_date)
  end.setHours(0, 0, 0, 0) // Strip off time part

  // Check if the new date range overlaps with any existing date ranges
  for (let record of allRecords) {
    const recordStart = new Date(record.start_date)
    recordStart.setHours(0, 0, 0, 0)

    const recordEnd = new Date(record.end_date)
    recordEnd.setHours(0, 0, 0, 0)

    if ((start >= recordStart && start <= recordEnd) || (end >= recordStart && end <= recordEnd)) {
      res.status(200).json({ isDuplicate: true })

      return
    }
  }

  res.status(200).json({ isDuplicate: false })
}

export default handler
