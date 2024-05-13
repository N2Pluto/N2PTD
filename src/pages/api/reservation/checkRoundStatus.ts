// /api/reservation/checkRoundStatus.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    const { data, error } = await supabase
      .from('Reservation_System')
      .select('start_date, end_date, round_status')
      .single()

    if (error) {
      console.error('Error fetching round data:', error)

      return res.status(500).json({ error: 'Failed to fetch round data' })
    }

    if (!data) {
      return res.status(404).json({ error: 'No active round found' })
    }

    const { start_date, end_date, round_status } = data
    const currentDate = new Date()
    const start = new Date(start_date)
    const end = new Date(end_date)

    const isValidRound = currentDate >= start && currentDate <= end

    if (isValidRound !== round_status) {
      // Update round_status if it does not match isValidRound
      const { error: updateError } = await supabase
        .from('Reservation_System')
        .update({ round_status: isValidRound })
        .eq('round_status', !isValidRound)

      if (updateError) {
        console.error('Error updating round status:', updateError)

        return res.status(500).json({ error: 'Failed to update round status' })
      }
    }

    return res.status(200).json({ isValidRound })
  } catch (error) {
    console.error('Error checking round status:', error)

    return res.status(500).json({ error: 'Failed to check round status' })
  }
}

export default handler
