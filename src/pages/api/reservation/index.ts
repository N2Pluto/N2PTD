import middleware from '../middleware'
import supabase from 'src/libs/supabase'

function handler(req: any, res: any) {
    middleware(req, res, async () => {
        const { user_id, dorm_id, room_id, bed_id } = req.body
        try {
            const { data, error } = await supabase.from('Reservation').insert([
                {
                    user_id,
                    dorm_id,
                    room_id,
                    bed_id
                }
            ])

            if (error) {
                throw new Error('Error inserting data into Reservation table')
            } else {
                res.status(200).json({ data })
            }
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })
}

export default handler
