// /api/admin/renewalSystem/delete/deleteReservation.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.body
  console.log(req.body)

  try {
    // Select the user_id from Renewal_Dormitory table
    const { data, error } = await supabase.from('Renewal_Dormitory').select('user_id').eq('id', id)

    if (error) {
      throw error
    }

    const userId = data[0].user_id
    console.log('user_id', userId)

    // Delete the corresponding record from Dormitory_Resident table
    const { error: errorResident } = await supabase.from('Dormitory_Resident').delete().eq('user_id', userId)

    if (errorResident) {
      throw errorResident
    }

    // Delete the corresponding record from Dormitory_Approve table
    const { error: errorApprove } = await supabase.from('Dormitory_Approve').delete().eq('user_id', userId)

    if (errorApprove) {
      throw errorApprove
    }

    // Delete the corresponding record from Reservation table
    const { error: errorReservation } = await supabase.from('Reservation').delete().eq('user_id', userId)

    if (errorReservation) {
      throw errorReservation
    }

    const { error: deleteError } = await supabase.from('Renewal_Dormitory').delete().eq('id', id)
    if (deleteError) {
      throw deleteError
    }

    res.status(200).json({ message: 'Data deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
