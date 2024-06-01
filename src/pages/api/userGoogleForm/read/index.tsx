// this is /api/userGoogleForm/read/index.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { data, error } = await supabase
    .from('Google_Form')
    .select('*')
    .order('id', { ascending: true })
    .eq('status', true)

  if (error) {
    res.status(500).json({ error })
    console.error(error)

    return
  }

  res.status(200).json({ data })
}

export default handler
