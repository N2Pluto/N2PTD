// /api/reservation/checkReservationQualification.ts
import supabase from 'src/libs/supabase'

// ฟังก์ชันเช็คสถานะรอบการจอง
const checkRoundStatus = async (startDate: string, endDate: string): Promise<boolean> => {
  const currentDate = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (currentDate < start || currentDate > end) {
    // ถ้าเวลาปัจจุบันไม่อยู่ในช่วง start_date และ end_date
    const { error } = await supabase
      .from('Reservation_System')
      .update({ round_status: false })
      .eq('round_status', true)

    if (error) {
      console.error('Error updating round status:', error)
      
      return false
    }
  }

  return currentDate >= start && currentDate <= end
}

// ฟังก์ชันเช็คคุณสมบัติของนักศึกษา
const checkUserQualification = (userYear: number, reservationYear: number[]): boolean => {
  return reservationYear.includes(userYear)
}

const handler = async (req: any, res: any) => {
  try {
    const { data, error } = await supabase.from('Reservation_System').select('*').eq('round_status', true).single()

    if (error) throw error

    const { start_date, end_date, student_year } = data
    const isValidRound = await checkRoundStatus(start_date, end_date)
    const isValidUser = checkUserQualification(req.body.userYear, student_year)

    if (isValidRound && isValidUser) {
      res.status(200).json({ isEligible: true })
    } else {
      res.status(200).json({ isEligible: false })
    }
  } catch (error) {
    console.error('Error checking reservation qualification:', error)
    res.status(500).json({ error: 'Failed to check reservation qualification' })
  }
}

export default handler
