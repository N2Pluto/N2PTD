// this is /api/admin/create/createBuilding.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { error } = await supabase.from('facebook').insert([
    {
      href: req.body.href
    }
  ])

  if (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  } else {
    const { data, error } = await supabase.from('facebook').select('*').eq('id', req.body.id).single()

    if (error) {
      console.error(error)
      res.status(500).json({ error: error.message })
    } else {
      res.status(200).json({ data })
    }
  }
}

export default handler

