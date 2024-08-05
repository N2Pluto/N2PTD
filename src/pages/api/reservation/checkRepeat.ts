import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { bed_id } = req.query

  const client = await supabase.connect()

  try {
    await client.query('BEGIN')

    // Lock the row for the specific bed_id to prevent concurrent access
    const { data: lockData, error: lockError } = await client
      .from('Reservation')
      .select('bed_id')
      .eq('bed_id', bed_id)
      .for('UPDATE')

    if (lockError) {
      throw lockError
    }

    // Check if the bed is already reserved
    const isReserved = lockData.length > 0

    await client.query('COMMIT')

    res.status(200).json({ isReserved })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(error)
    res.status(500).json({ error: 'Error checking bed reservation: ' + error.message })
  } finally {
    client.release()
  }
}

export default handler
