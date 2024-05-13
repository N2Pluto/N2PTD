// this is /api/admin/reservationSystem/delete/deleteRound.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  if (req.method === 'DELETE') {
    const { id } = req.query

    try {
      // 1. Delete reservations associated with the round
      await supabase.from('Reservation').delete().eq('round_id', id)

      // 2. Delete the round
      const { error } = await supabase.from('Reservation_System').delete().eq('id', id)

      if (error) {
        console.error(error)
        res.status(500).json({ error: 'An error occurred while deleting the round.' })
      } else {
        res.status(200).json({ message: 'Round and associated reservations deleted successfully.' })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'An error occurred while deleting the round.' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' })
  }
}

export default handler

