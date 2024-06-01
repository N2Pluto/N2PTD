// this is /api/admin/googleForm/read/readByID/[id].ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { id } = req.query
  const { data, error } = await supabase.from('Google_Form').select('*').order('id', { ascending: true }).eq('id', id).single()
  if (error) {
    res.status(500).json({ error })
    console.error(error)

    return
  }

  res.status(200).json({ data })
}

export default handler
