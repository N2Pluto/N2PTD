// this is /api/admin/create/createBuilding.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { error } = await supabase.from('post').insert([
    {
      header: req.body.header,
      title: req.body.title,
      image: req.body.image
    }
  ])
}

export default handler
