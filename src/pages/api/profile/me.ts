import middleware from '../middleware'
import supabase from 'src/libs/supabase'

function handler(req: any, res: any) {
  middleware(req, res, async () => {
    console.log('user', req.user)

    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('student_id , email , user_id')
      .eq('user_id', req.user.user_id)
      .limit(1)
      .single()

      console.log('userData', userData)

    const { data: reservationData, error: reservationError } = await supabase
      .from('Reservation')
      .select('user_id, dorm_id, room_id, bed_id')
      .eq('user_id', req.user.user_id)
      .limit(1)
      .single()

      console.log('reservationData', reservationData)

    if (userError || reservationError) {
      res.status(500).json({ error: userError?.message || reservationError?.message })
    } else {
      res.status(200).json({ User: { ...userData, ...reservationData } })
    }
  })
}

export default handler
