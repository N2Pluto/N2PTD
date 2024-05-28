// this is /api/admin/renewalDormitory/create/pullFormResident.ts
import supabase from 'src/libs/supabase'

async function handler(req: any, res: any) {
  try {
    // Fetch unique resident data from Dormitory_Resident
    const { data: residents, error: fetchError } = await supabase
      .from('Dormitory_Resident')
      .select('id, dorm_id, room_id, bed_id, user_id, round_id', { count: 'exact' })

    if (fetchError) throw fetchError

    // Check for duplicates and insert unique residents into Renewal_Dormitory
    for (const resident of residents) {
      const { id, dorm_id, room_id, bed_id, user_id, round_id } = resident

      // Check if the resident already exists in Renewal_Dormitory
      const { data: existing, error: checkError } = await supabase.from('Renewal_Dormitory').select('id').eq('id', id)

      if (checkError) throw checkError

      // If the resident does not exist, insert it into Renewal_Dormitory
      if (existing.length === 0) {
        const { error: insertError } = await supabase
          .from('Renewal_Dormitory')
          .insert({ id, dorm_id, room_id, bed_id, user_id, round_id })

        if (insertError) throw insertError
      }
    }

    res.status(200).json({ message: 'Residents inserted successfully' })
  } catch (error) {
    console.error('Error processing residents:', error)
    res.status(500).json({ error: 'Failed to process residents' })
  }
}

export default handler
