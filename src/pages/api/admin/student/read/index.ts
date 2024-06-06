// /api/admin/student/read/index.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    const { data, error } = await supabase.from('Student').select(`
        *
        
      `)

    if (error) {
      throw error
    }

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
