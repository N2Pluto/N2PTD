import supabase from 'src/libs/supabase'

const handler = async (req: any, res: any) => {
  try {
    const { user_id } = req.body

    // Fetch data from Users table
    const { data: userData, error: userError } = await supabase.from('Users').select('*').eq('user_id', user_id)

    if (userError || userData.length === 0) {
      throw new Error(userError?.message || 'No user found')
    }

    // Fetch data from Users_Info table
    const { data: userInfoData, error: userInfoError } = await supabase
      .from('Users_Info')
      .select('*')
      .eq('user_id', user_id)

    if (userInfoError ) {
      throw new Error(userInfoError?.message || 'No user info found')
    }

    // Fetch data from Users_Req table
    const { data: userReqData, error: userReqError } = await supabase
      .from('Users_Req')
      .select('*')
      .eq('user_id', user_id)

    if (userReqError || userReqData.length === 0) {
      throw new Error(userReqError?.message || 'No user request found')
    }

    // Fetch data from Reservation table
    const { data: reservationData, error: reservationError } = await supabase
      .from('Reservation')
      .select('*')
      .eq('user_id', user_id)

    if (reservationError) {
      throw new Error(reservationError.message || 'No reservation found')
    }

    res.status(200).json({ userData: userData[0], userInfoData: userInfoData[0], userReqData: userReqData[0] , reservationData: reservationData[0]})
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
