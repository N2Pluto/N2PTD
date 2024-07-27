// /api/reservation/bed/checkBed.ts
import supabase from 'src/libs/supabase'

const handler = async (req : any, res : any) => {
  try {
    // Fetch all bed_ids from Reservation table
    const { data: reservationData, error: reservationError } = await supabase.from('Reservation').select('bed_id')

    if (reservationError) {
      throw reservationError
    }

    // Get all bed_ids from the Dormitory_Bed table
    const { data: allBeds, error: allBedsError } = await supabase.from('Dormitory_Bed').select('bed_id')

    if (allBedsError) {
      throw allBedsError
    }

    const reservedBedIds = reservationData.map(r => r.bed_id)
    const allBedIds = allBeds.map(b => b.bed_id)

    // Update bed_status in Dormitory_Bed table based on reservation
    const updatePromises = allBedIds.map(async bed_id => {
      const bedStatus = reservedBedIds.includes(bed_id) ? false : true

      const { data: updateData, error: updateError } = await supabase
        .from('Dormitory_Bed')
        .update({ bed_status: bedStatus })
        .eq('bed_id', bed_id)

      if (updateError) {
        throw updateError
      }
    })

    await Promise.all(updatePromises)

    return res.status(200).json({ message: 'Bed statuses updated successfully' })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export default handler
