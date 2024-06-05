// /api/admin/renewalSystem/create/createReservation.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { user_id } = req.body
  console.log(req.body)

  try {
    // Delete the corresponding record from Dormitory_Resident table
    const { error: deleteError } = await supabase.from('Dormitory_Resident').delete().eq('user_id', user_id)

    if (deleteError) {
      throw deleteError
    }

    // Update payment_status in Reservation
    const { error: updateError } = await supabase
      .from('Reservation')
      .update({ payment_status: 'Pending' })
      .eq('user_id', user_id)

    if (updateError) {
      throw updateError
    }

    res.status(200).json({ message: 'Data updated and reservation created successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
