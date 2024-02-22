import middleware from '../middleware'
import supabase from 'src/libs/supabase'

function handler(req: any, res: any) {
  middleware(req, res, async () => {
    console.log('user', req.user)

    try {
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('student_id, email, user_id')
        .eq('user_id', req.user.user_id)
        .limit(1)
        .single()

      console.log('userData', userData)

      const { data: reservationData, error: reservationError } = await supabase
        .from('Reservation')
        .select('user_id, dorm_id, room_id, bed_id') // ระบุ reservation_id ใน select
        .eq('user_id', req.user.user_id)
        .limit(1)
        .single()

      console.log('reservationData', reservationData)

      if (userError || reservationError) {
        res.status(500).json({ error: userError?.message || reservationError?.message })
      } else {
        if (!userData || !reservationData) {
          res.status(500).json({ error: "JSON object requested, multiple (or no) rows returned" })
        } else {
          res.status(200).json({ User: { ...userData, ...reservationData } })
        }
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

export default handler
