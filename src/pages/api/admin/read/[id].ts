import supabase from 'src/libs/supabase'

const handler = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('Dormitory_Building')
      .select('*')
      .eq('dorm_id', req.query.id)
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching data:', error)
      return res.status(500).json({ error: 'Failed to fetch building data' })
    }

    // Adjusted to return data in a property named `data`
    res.status(200).json({ data: data || [] })
  } catch (error) {
    console.error('Server-side error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default handler
