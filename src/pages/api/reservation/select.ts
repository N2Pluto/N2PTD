import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { user_id } = req.query

  try {
    // Fetch reservation details
    const { data: reservationData, error: reservationError } = await supabase
      .from('Reservation')
      .select(
        `
        id,
        dorm_id,
        user_id,
        room_id,
        bed_id,
        round_id,
        status,
        payment_status,
        created_at,
        Dormitory_Building (name),
        Dormitory_Room (room_number),
        Dormitory_Bed (bed_number),
        Reservation_System (round_name)
      `
      )
      .eq('user_id', user_id)

    if (reservationError) throw new Error(reservationError.message)

    // Fetch user info details
    const { data: userInfoData, error: userInfoError } = await supabase
      .from('Users_Info')
      .select('name, lastname')
      .eq('user_id', user_id)

    if (userInfoError) throw new Error(userInfoError.message)

    // Group reservations by dorm_id, room_id, bed_id, and round_id
    const groupedReservations = reservationData.reduce((acc, reservation) => {
      const key = `${reservation.dorm_id}-${reservation.room_id}-${reservation.bed_id}-${reservation.round_id}`
      if (!acc[key]) acc[key] = []
      acc[key].push(reservation)
      return acc
    }, {})

    // Check for duplicates and delete the newer ones
    for (const key in groupedReservations) {
      if (groupedReservations[key].length > 1) {
        const sortedReservations = groupedReservations[key].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        const [, ...duplicates] = sortedReservations
        const duplicateIds = duplicates.map(duplicate => duplicate.id)

        if (duplicateIds.length > 0) {
          const { error: deleteError } = await supabase.from('Reservation').delete().eq('id', duplicateIds)
          if (deleteError) throw new Error(deleteError.message)
        }
      }
    }

    res.status(200).json({ reservationData, userInfoData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
