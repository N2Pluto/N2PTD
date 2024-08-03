import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    const { data, error } = await supabase.from('Dormitory_Building').select('*').order('dorm_id', { ascending: true })

    if (error) {
      throw error
    }

    res.status(200).json({ data })
  } catch (error) {
    console.error('Error fetching dormitory building data:', error)
    res.status(500).json({ error: 'Internal Server Error', details: error.message })
  }
}

export default handler
