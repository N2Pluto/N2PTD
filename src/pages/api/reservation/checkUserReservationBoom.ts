import { NextApiRequest, NextApiResponse } from 'next'
import supabase from 'src/libs/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { room_id } = req.query

  try {
    // Assuming you have a 'reservations' table in your database
    const { data, error } = await supabase
      .from('Reservation')
      .select(
        `
      user_id,
      Users (name, lastname ,  course, student_id ,religion , student_year , region , school )

    `
      )
      .eq('room_id', room_id)

    if (error) {
      throw error
    }

    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching reservation data:', error.message)
    res.status(500).json({ error: 'Error fetching reservation data' })
  }
}
