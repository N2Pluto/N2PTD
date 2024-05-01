// /api/admin/reservationSystem/update/index.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    const { start_date, end_date, student_year, id , round_name } = req.body
    console.log(req.body)

    const { data, error } = await supabase
      .from('Reservation_System')
      .update({
        start_date,
        end_date,
        student_year,
        round_name
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

