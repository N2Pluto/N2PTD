// /api/admin/renewalSystem/create/createReservation.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { user_id, id } = req.body
  console.log(req.body)

  try {
    // Delete the corresponding record from Dormitory_Resident table
    const { error: deleteError } = await supabase.from('Dormitory_Resident').delete().eq('user_id', user_id)

    if (deleteError) {
      throw deleteError
    }

    // Update status in Dormitory_Approve
    const { error: updateApproveError } = await supabase
      .from('Dormitory_Approve')
      .update({ status: '' })
      .eq('user_id', user_id)

    if (updateApproveError) {
      throw updateApproveError
    }

    const { error: updateError } = await supabase.from('Renewal_Dormitory').update({ status: 'success' }).eq('id', id)

    if (updateError) {
      throw updateError
    }

    res.status(200).json({ message: 'Data updated and reservation created successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
