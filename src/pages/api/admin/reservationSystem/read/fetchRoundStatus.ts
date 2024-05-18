// /api/admin/reservationSystem/read/fetchRoundStatus.ts
import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { data, error } = await supabase.from('Reservation_System').select('*')

  if (error) return res.status(500).json({ error: error.message })

  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0) // Strip off time part

  for (let record of data) {
    const start = new Date(record.start_date)
    start.setHours(0, 0, 0, 0) // Strip off time part

    const end = new Date(record.end_date)
    end.setHours(0, 0, 0, 0) // Strip off time part

    if (currentDate < start || currentDate > end) {
      // If currentDate is not within the range of start_date and end_date, update round_status to false
      const { error: updateError } = await supabase
        .from('Reservation_System')
        .update({ round_status: false })
        .eq('id', record.id)

      if (updateError) {
        console.error('Error updating round status:', updateError)
      }
    }
  }

  return res.status(200).json(data)
}

export default handler
