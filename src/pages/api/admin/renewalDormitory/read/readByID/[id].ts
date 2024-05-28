// this is /api/admin/renewalDormitory/read/readByID/[id].ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { id } = req.query
  console.log('api id:', id)

  const { data, error } = await supabase.from('Renewal_System').select('*').eq('id', id).single()

  if (error) {
    res.status(500).json({ error })
    console.error(error)
    return
  }

  res.status(200).json({ data })
}

export default handler

