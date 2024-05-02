// /api/reservation/fetchRoundProfile.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    const { data, error } = await supabase
      .from('Reservation_System')
      .select('*')
      .eq('round_status', true)
      .single()

    if (error) {
      console.error('Error fetching round data:', error)

      return res.status(500).json({ error: 'Failed to fetch round data' })
    }

    if (!data) {
      return res.status(404).json({ error: 'No active round found' })
    }

    return res.status(200).json({ data })
  } catch (error) {
    console.error('Error checking round status:', error)

    return res.status(500).json({ error: 'Failed to check round status' })
  }
}

export default handler
