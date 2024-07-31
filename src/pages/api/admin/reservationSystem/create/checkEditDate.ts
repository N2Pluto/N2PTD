// this is /api/admin/reservationSystem/create/checkEditDate
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { start_date, end_date, id } = req.body

  // Fetch the record with the specified id
  const { data: currentRecord, error: fetchCurrentError } = await supabase
    .from('Reservation_System')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchCurrentError) {
    console.error('Error fetching the current record:', fetchCurrentError)
    res.status(500).json({ error: 'Failed to fetch the current record' })
    return
  }

  // If the record is not found, return an error
  if (!currentRecord) {
    res.status(400).json({ error: 'Invalid record' })
    return
  }

  const currentStatus = currentRecord.round_status

  // Fetch all records
  const { data: allRecords, error: fetchError } = await supabase.from('Renewal_System').select('*')

  if (fetchError) {
    console.error('Error fetching records:', fetchError)
    res.status(500).json({ error: 'Failed to fetch records' })
    return
  }

  const start = new Date(start_date)
  start.setHours(0, 0, 0, 0) // Strip off time part

  const end = new Date(end_date)
  end.setHours(0, 0, 0, 0) // Strip off time part

  console.log(`Checking for overlap with start_date: ${start}, end_date: ${end}`)

  if (currentStatus) {
    // If current record status is true, check that end_date does not exceed start_date of any other records
    for (let record of allRecords) {
      if (record.id !== id) {
        const recordStart = new Date(record.start_date)
        recordStart.setHours(0, 0, 0, 0)

        console.log(`Comparing with record id ${record.id}: start_date: ${recordStart}`)

        if (end > recordStart) {
          console.log('Overlap found')
          res.status(200).json({ isDuplicate: true })
          return
        }
      }
    }
  } else {
    // If current record status is false, check that start_date and end_date do not overlap with any records with status true
    for (let record of allRecords) {
      if (record.status) {
        const recordStart = new Date(record.start_date)
        recordStart.setHours(0, 0, 0, 0)

        const recordEnd = new Date(record.end_date)
        recordEnd.setHours(0, 0, 0, 0)

        console.log(`Comparing with record id ${record.id}: start_date: ${recordStart}, end_date: ${recordEnd}`)

        if (
          (start >= recordStart && start <= recordEnd) ||
          (end >= recordStart && end <= recordEnd) ||
          (start <= recordStart && end >= recordEnd)
        ) {
          console.log('Overlap found')
          res.status(200).json({ isDuplicate: true })
          return
        }
      }
    }
  }

  console.log('No overlap found')
  res.status(200).json({ isDuplicate: false })
}

export default handler
