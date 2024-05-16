// /api/admin/reservationSystem/update/index.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    const { start_date, end_date, student_year, id, round_name } = req.body
    console.log(req.body)

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0) // Strip off time part

    const start = new Date(start_date)
    start.setHours(0, 0, 0, 0) // Strip off time part

    const end = new Date(end_date)
    end.setHours(0, 0, 0, 0) // Strip off time part

    // Fetch all records from the database
    const { data: allRecords, error: fetchError } = await supabase.from('Reservation_System').select('*')

    if (fetchError) {
      console.error('Error fetching records:', fetchError)
      return res.status(500).json({ error: fetchError.message })
    }

    // Check if the new date range overlaps with any existing date ranges
    for (let record of allRecords) {
      if (record.id !== id) {
        const recordStart = new Date(record.start_date)
        recordStart.setHours(0, 0, 0, 0)

        const recordEnd = new Date(record.end_date)
        recordEnd.setHours(0, 0, 0, 0)

        if ((start >= recordStart && start <= recordEnd) || (end >= recordStart && end <= recordEnd)) {
          return res.status(400).json({ error: 'The new date range overlaps with an existing date range' })
        }
      }
    }

    let round_status = false
    if (currentDate >= start && currentDate <= end) {
      round_status = true
    }

    const { data, error } = await supabase
      .from('Reservation_System')
      .update({
        start_date,
        end_date,
        student_year,
        round_name,
        round_status
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating round:', error) // Log detailed error

      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ data })
  } catch (error) {
    console.error('Failed to update round:', error)

    return res.status(500).json({ error: 'Failed to update round' })
  }
}

export default handler
