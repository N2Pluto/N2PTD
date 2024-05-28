// this is /api/admin/renewalDormitory/create/createRenewalForm.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  let { renewalName, renewalPhase, startDate, endDate } = req.body
  console.log(req.body)

  const { data, error } = await supabase.from('Renewal_System').insert([
    {
      renewal_name: renewalName,
      renewal_phase: renewalPhase,
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
