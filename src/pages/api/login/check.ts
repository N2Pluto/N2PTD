// api/login/check.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    const { user_id } = req.body
    const { data, error } = await supabase.from('Users_Info').select('name').eq('user_id', user_id).single()

    if (error) throw error

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
