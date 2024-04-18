import middleware from '../middleware'
import supabase from 'src/libs/supabase'

function handler(req: any, res: any) {
  middleware(req, res, async () => {
    console.log('user_d', req.user)

    try {
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('student_id, email, user_id')
        .eq('user_id', req.user.user_id)
        .limit(1)
        .single()

      console.log('userData', userData)

      const { data : reservationData} = await supabase
      .from('Reservation')
      .select('dorm_id, room_id, bed_id')
      .eq('user_id', req.user.user_id)
      .limit(1)
      .single()

      console.log('reservationData', reservationData)

      if (userError) {
        res.status(500).json({ error: userError?.message  })

        return
      }
      if (!userData ) {
        res.status(500).json({ error: "JSON object requested, multiple (or no) rows returned" })

        return
      }

      res.status(200).json({ data: userData, reservationData})

    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}


export default handler
