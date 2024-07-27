// /api/userForm/read/fetchChangeRoom.ts

import supabase from 'src/libs/supabase'

const handler = async (req : any, res : any) => {
  // Fetch data from Form_TransferRoom including related dormitory details
  const { data: changeRoomData, error: changeRoomError } = await supabase.from('Form_ChangeRoom').select(`
      *,
      Dormitory_Building (name),
      Dormitory_Room (room_number),
      Dormitory_Bed (bed_number)
    `)

  if (changeRoomError) {
    console.error(changeRoomError.message)
    return res.status(500).json({ error: changeRoomError.message })
  }

  // Initialize an array to hold the combined data
  let combinedData = []

  // Iterate over each changeRoomData item to fetch and combine user info
  for (const item of changeRoomData) {
    const { data: userInfoData, error: userInfoError } = await supabase
      .from('Users_Info')
      .select('name, lastname')
      .eq('user_id', item.user_id)
      .single() // Assuming each user_id corresponds to a single user

    if (userInfoError) {
      console.error(userInfoError.message)
      // Optionally handle the error, e.g., continue to the next iteration
      continue
    }

    // Combine the current item with fetched user info
    combinedData.push({
      ...item,
      userInfo: userInfoData ? userInfoData : null
    })
  }

  // Return the combined data
  return res.status(200).json(combinedData)
}

export default handler
