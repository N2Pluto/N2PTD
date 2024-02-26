import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  const { user_id } = req.query

  try {
    const { data: reservationData, error: selectError } = await supabase.from('Reservation').select()

    if (selectError) {
      throw selectError
    }

    if (reservationData && reservationData.length > 0) {
      console.log('All Reservation data:', reservationData)

      let foundReservation = false
      let room_id = null
      let bed_id = null // Add this line

      reservationData.forEach((reservation: any) => {
        console.log('Checking reservation:', reservation)
        console.log('User ID to match:', user_id)
        if (reservation.user_id === user_id) {
          foundReservation = true
          room_id = reservation.room_id
          bed_id = reservation.bed_id // Add this line
          console.log('Match found for user_id:', user_id)
          return
        }
      })

      if (foundReservation) {
        console.log('Reservation found for user_id:', user_id)

        const { data, error } = await supabase.from('Reservation').delete().eq('user_id', user_id)

        if (error) {
          console.error('Error deleting reservation:', error.message)
          res.status(500).json({ error: 'Failed to delete reservation' })
        }

        // Update the bed_status in the Dormitory_Bed table
        const { error: updateBedError } = await supabase
          .from('Dormitory_Bed')
          .update({ bed_status: true })
          .eq('bed_id', bed_id)

        if (updateBedError) {
          throw updateBedError
        }

        // Fetch the current bed_available for the room
        const { data: roomData, error: roomError } = await supabase
          .from('Dormitory_Room')
          .select('bed_available')
          .eq('room_id', room_id)

        if (roomError) {
          throw new Error('Error fetching data from Dormitory_Room table')
        }

        // Decrement the bed_available by 1
        const newBedAvailable = roomData[0].bed_available - 1

        // Update the bed_available in the Dormitory_Room table
        const { error: updateError } = await supabase
          .from('Dormitory_Room')
          .update({ bed_available: newBedAvailable })
          .eq('room_id', room_id)

        if (updateError) {
          throw new Error('Error updating data in Dormitory_Room table')
        }

        res.status(200).json({ data })
      } else {
        console.log('No reservation found for user_id:', user_id)
        res.status(404).json({ error: 'Reservation not found for the user_id provided' })
      }
    } else {
      console.log('No reservations found')
      res.status(404).json({ error: 'No reservations found' })
    }
  } catch (error) {
    console.error('Error deleting reservation:', error.message)
    res.status(500).json({ error: 'Failed to delete reservation' })
  }
}

export default handler
