// /api/reservation/checkRepeat.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { bed_id } = req.query

  try {
    const { data, error } = await supabase.from('Reservation').select('bed_id').eq('bed_id', bed_id)

    if (error) {
      throw error
    }

    const isReserved = data.length > 0

    res.status(200).json({ isReserved })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error checking bed reservation: ' + error.message })
  }
}

export default handler
