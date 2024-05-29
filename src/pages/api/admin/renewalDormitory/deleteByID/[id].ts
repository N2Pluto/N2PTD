// this is /api/admin/renewalDormitory/deleteByID/[id].ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  if (req.method === 'DELETE') {
    const { id } = req.query
    const { data, error } = await supabase.from('Renewal_System').delete().eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
        
    return res.status(200).json({ data })
  }

  res.setHeader('Allow', ['DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}

export default handler
