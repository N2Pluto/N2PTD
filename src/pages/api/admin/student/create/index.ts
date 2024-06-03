// /api/admin/student/create/index.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const students = req.body

  try {
    const { data, error } = await supabase.from('Student').insert(students)

    if (error) {
      throw error
    }

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
