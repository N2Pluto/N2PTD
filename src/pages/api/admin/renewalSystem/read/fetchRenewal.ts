// this is /api/admin/renewalSystem/read/fetchRenewal.ts

import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  const { data: renewalSystemData, error: renewalSystemError } = await supabase
    .from('Renewal_System')
    .select('*')
    .single()

  if (renewalSystemError) return res.status(500).json({ error: renewalSystemError.message })

  if (renewalSystemData.status === false) {
    const { error: updateError } = await supabase
      .from('Dormitory_Resident')
      .update({ renew_status: 'leave' })
      .match({ renew_status: 'Pending' })

    if (updateError) return res.status(500).json({ error: updateError.message })
  }
  const { data: renewalData, error: renewalError } = await supabase
    .from('Dormitory_Resident')
    .select(
      '*, Users(student_id,email),Dormitory_Building(name),Dormitory_Room(room_number),Dormitory_Bed(bed_number),Reservation_System(round_name)'
    )
    .order('id', { ascending: true })

  if (renewalError) return res.status(500).json({ error: renewalError.message })
  const { data: usersInfoData, error: usersInfoError } = await supabase.from('Users_Info').select('*')
  if (usersInfoError) return res.status(500).json({ error: usersInfoError.message })

  const data = renewalData.map(renewal => {
    const userInfo = usersInfoData.find(user => user.user_id === renewal.user_id)

    return { ...renewal, Users_Info: userInfo }
  })

  res.status(200).json({ data })
}

export default handler
