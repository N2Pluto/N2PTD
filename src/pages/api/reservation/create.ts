// import supabase from 'src/libs/supabase'

// const handler = async (req: any, res: any) => {
//   try {
//     const { dorm_id} = req.body
//     const { room_id } = req.body
//     const { bed_id } = req.body

//     const { data, error } = await supabase.from('Reservation').insert([{ dorm_id, room_id, bed_id }])

//     if (error) {
//       console.error('Error inserting data into Reservation table:', error.message)
//       res.status(500).json({ error: error.message })
//     } else {
//       console.log('Data inserted successfully:', data)
//       res.status(200).json({ data }) // Make sure the response contains the inserted data
//     }
//   } catch (error) {
//     console.error('Error inserting data into Reservation table:', error.message)
//     res.status(500).json({ error: error.message })
//   }
// }

// export default handler
