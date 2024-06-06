// /api/admin/residentApprove/update/updateResidentApprove.ts
import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { updatedUsers } = req.body
  const TRUE = 'TRUE'
  // Check if updatedUsers is an array

  if (!Array.isArray(updatedUsers)) {
    return res.status(400).json({ error: 'updatedUsers must be an array' })
  }

  // Update each user in the database
  for (const user of updatedUsers) {
    const { data, error } = await supabase
      .from('Reservation')
      .update({
        payment_status: user.payment_status === null || user.payment_status === '' ? TRUE : user.payment_status
      })
      .eq('user_id', user.user_id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(200).json({ message: 'Users updated successfully' })
}

export default handler
