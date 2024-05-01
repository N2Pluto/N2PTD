import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { bed_id } = req.body

  const { error } = await supabase.from('Dormitory_Bed').delete().eq('bed_id', bed_id)

  if (error) {
    console.error('Error deleting bed:', error.message)
    res.status(500).json({ error: error.message })
    return
  }

  res.status(200).json({ message: 'Bed deleted successfully' })
}

export default handler
