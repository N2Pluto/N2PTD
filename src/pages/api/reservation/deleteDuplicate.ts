// this is /api/reservation/deleteDuplicate

import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    // Fetch all reservations
    const { data: reservations, error } = await supabase.from('Reservation').select('id, bed_id, created_at')

    if (error) throw error

    // Group reservations by bed_id
    const bedIdMap = reservations.reduce((acc: any, reservation: any) => {
      if (!acc[reservation.bed_id]) {
        acc[reservation.bed_id] = []
      }
      acc[reservation.bed_id].push(reservation)
      return acc
    }, {})

    // Find duplicates and keep only the earliest created reservation for each bed_id
    const toDelete = []
    for (const bed_id in bedIdMap) {
      if (bedIdMap[bed_id].length > 1) {
        bedIdMap[bed_id].sort((a: any, b: any) => new Date(a.created_at) - new Date(b.created_at))
        const [earliest, ...duplicates] = bedIdMap[bed_id]
        toDelete.push(...duplicates.map((reservation: any) => reservation.id))
      }
    }

    let deletedData = []
    if (toDelete.length > 0) {
      // Delete duplicates and return deleted records
      const { data: deleted, error: deleteError } = await supabase
        .from('Reservation')
        .delete()
        .in('id', toDelete)
        .select('*')

      if (deleteError) throw deleteError
      deletedData = deleted
    }

    res.status(200).json({ message: 'Duplicate reservations deleted successfully', deleted: deletedData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
