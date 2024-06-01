// this is /api/admin/googleForm/create/index.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  let { formName, formUrl, startDate, endDate } = req.body
  console.log(req.body)

  const { data, error } = await supabase.from('Google_Form').insert([
    {
      form_name: formName,
      form_url: formUrl,
      start_date: startDate,
      end_date: endDate
    }
  ])

  if (error) {
    res.status(500).json({ error })
    console.error(error)
    return
  }

  res.status(200).json({ data })
}

export default handler
