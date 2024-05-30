
// /api/admin/renewalSystem/delete/clearHistory.ts

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { id } = req.body
  console.log(req.body)

  try {
    const { error: errorResident } = await supabase.from('Renewal_Dormitory').delete().eq('id', id)

    if (errorResident) {
      throw errorResident
    }

    res.status(200).json({ message: 'Data deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
