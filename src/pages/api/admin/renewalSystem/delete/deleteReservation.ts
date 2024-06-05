// /api/admin/renewalSystem/delete/deleteReservation.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.body
  console.log(req.body)

  try {
    // Select the user_id from Dormitory_Resident table
    const { data, error } = await supabase.from('Dormitory_Resident').select('user_id').eq('id', id)

    if (error) {
      throw error
    }

    const userId = data[0].user_id
    console.log('user_id', userId)

    // Delete the corresponding record from Dormitory_Resident table
    const { error: errorResident } = await supabase.from('Dormitory_Resident').delete().eq('id', id)

    if (errorResident) {
      throw errorResident
    }

    // Delete the corresponding record from Reservation table
    const { error: errorReservation } = await supabase.from('Reservation').delete().eq('user_id', userId)

    if (errorReservation) {
      throw errorReservation
    }

    res.status(200).json({ message: 'Data deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
