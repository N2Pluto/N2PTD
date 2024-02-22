// this is /api/reservation/delete
import supabase from 'src/libs/supabase';

const handler = async (req: any, res: any) => {
  const { user_id } = req.query

  try {
    const { data, error } = await supabase.from('Reservation').delete().eq('user_id', user_id)

    if (error) {
      throw error
    }

    res.status(200).json({ data })
  } catch (error) {
    console.error('Error deleting reservation:', error.message)
    res.status(500).json({ error: 'Failed to delete reservation' })
  }
}

export default handler
