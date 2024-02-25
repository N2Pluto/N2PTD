import middleware from '../middleware'
import supabase from 'src/libs/supabase'

function handler(req: any, res: any) {
  middleware(req, res, async () => {
    console.log('user_d', req.user)

    try {
      const { data: reservationData, error: userError } = await supabase
        .from('Reservation')
        .select('*')
        .eq('user_id', req.user.user_id)
        .limit(1)
        .single()

      console.log('reservationData', reservationData)


      if (userError  ) {
        res.status(500).json({ error: userError?.message  })

        return

      }

      if (!reservationData ) {
        res.status(500).json({ error: "JSON object requested, multiple (or no) rows returned" })

        return
      }

      res.status(200).json({ data: reservationData })

    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}


export default handler
