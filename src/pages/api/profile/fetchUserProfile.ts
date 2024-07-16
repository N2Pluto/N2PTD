import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    const { user_id } = req.body

    // Fetch data from Users table
    const { data: userData, error: userError } = await supabase.from('Users').select('*').eq('user_id', user_id)
    if (userError || !userData || userData.length === 0) {
      throw new Error(userError?.message || 'No user found')
    }

    // Fetch data from Users_Info table
    const { data: userInfoData, error: userInfoError } = await supabase
      .from('Users_Info')
      .select('*')
      .eq('user_id', user_id)
    if (userInfoError || !userInfoData) {
      throw new Error(userInfoError?.message || 'No user info found')
    }

    // Fetch data from Users_Req table
    const { data: userReqData, error: userReqError } = await supabase
      .from('Users_Req')
      .select('*')
      .eq('user_id', user_id)
    if (userReqError || !userReqData || userReqData.length === 0) {
      throw new Error(userReqError?.message || 'No user request found')
    }

    // Fetch data from Reservation table
    const { data: reservationData, error: reservationError } = await supabase
      .from('Reservation')
      .select('*')
      .eq('user_id', user_id)
    if (reservationError || !reservationData) {
      throw new Error(reservationError.message || 'No reservation found')
    }

    // Additional details fetch
    let dormitoryBuildingName = null,
      dormitoryRoomNumber = null,
      dormitoryBedNumber = null
    if (reservationData && reservationData.length > 0) {
      const { dorm_id, room_id, bed_id } = reservationData[0]

      // Fetch Dormitory_Building name
      if (dorm_id) {
        const { data: dormBuildingData } = await supabase
          .from('Dormitory_Building')
          .select('name')
          .eq('dorm_id', dorm_id)
        dormitoryBuildingName = dormBuildingData && dormBuildingData.length > 0 ? dormBuildingData[0].name : null
      }

      // Fetch Dormitory_Room number
      if (room_id) {
        const { data: dormRoomData } = await supabase
          .from('Dormitory_Room')
          .select('room_number')
          .eq('room_id', room_id)
        dormitoryRoomNumber = dormRoomData && dormRoomData.length > 0 ? dormRoomData[0].room_number : null
      }

      // Fetch Dormitory_Bed number
      if (bed_id) {
        const { data: dormBedData } = await supabase.from('Dormitory_Bed').select('bed_number').eq('bed_id', bed_id)
        dormitoryBedNumber = dormBedData && dormBedData.length > 0 ? dormBedData[0].bed_number : null
      }
    }

    res.status(200).json({
      userData: userData[0],
      userInfoData: userInfoData[0],
      userReqData: userReqData[0],
      reservationData: reservationData[0],
      dormitoryBuildingName,
      dormitoryRoomNumber,
      dormitoryBedNumber
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
