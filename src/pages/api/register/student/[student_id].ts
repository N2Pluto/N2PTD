// This is api/register/student/[student_id].ts
import supabase from 'src/libs/supabase'

export default async function handler(req: any, res: any) {
  const { student_id } = req.query

  try {
    const { data, error } = await supabase.from('Student').select('student_id').eq('student_id', student_id).single()

    if (error || !data) {
      res.status(404).json({ error: 'Student not found' })

      return
    }

    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching student data:', error.message)
    res.status(500).json({ error: 'Error fetching student data' })
  }
}
