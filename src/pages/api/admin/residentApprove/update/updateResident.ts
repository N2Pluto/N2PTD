// this is /api/admin/residentApprove/update/updateResident.ts


import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.body

  const { data, error: fetchError } = await supabase.from('Reservation').select('*').eq('id', id)

  if (fetchError || !data || data.length === 0) {
    console.error('Error fetching updated reservation data:', fetchError)
    res.status(500).json({ error: 'Failed to fetch updated reservation data' })
    return
  }

  // Update the status in Dormitory_Approve to "Success"
  const { error: updateError } = await supabase.from('Reservation').update({ payment_status: 'SUCCESS' }).eq('id', id)

  if (updateError) {
    console.error('Error updating status in Dormitory_Approve:', updateError)
    res.status(500).json({ error: 'Failed to update status in Dormitory_Approve' })
    return
  }

  const { error: insertError } = await supabase.from('Dormitory_Resident').insert({
    dorm_id: data[0].dorm_id,
    room_id: data[0].room_id,
    bed_id: data[0].bed_id,
    user_id: data[0].user_id,
    round_id: data[0].round_id
  })

  if (insertError) {
    console.error('Error inserting reservation data into Dormitory_Resident:', insertError)
    res.status(500).json({ error: 'Failed to insert reservation data into Dormitory_Resident' })
    return
  }

  res.status(200).json({ message: 'Reservation status updated successfully' })
}

export default handler
