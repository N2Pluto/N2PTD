// /api/reservation/checkReservationQualification.ts
import supabase from 'src/libs/supabase'

// Function to check round status
const checkRoundStatus = async (startDate: string, endDate: string): Promise<boolean> => {
  const currentDate = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (currentDate < start || currentDate > end) {
    // If the current time is not within the start_date and end_date range
    const { error } = await supabase.from('Reservation_System').update({ round_status: false }).eq('round_status', true)

    if (error) {
      console.error('Error updating round status:', error)
      return false
    }

    return false
  }

  return true
}

// Function to check user qualification
const checkUserQualification = (userYear: number, reservationYears: number[]): boolean => {
  return reservationYears.includes(userYear)
}

const handler = async (req: any, res: any) => {
  try {
    const { data, error } = await supabase.from('Reservation_System').select('*').eq('round_status', true).single()

    if (error || !data) {
      throw new Error('No active reservation round found or error fetching round data')
    }

    const { start_date, end_date, student_year } = data
    const isValidRound = await checkRoundStatus(start_date, end_date)

    if (!isValidRound) {
      return res.status(200).json({ isEligible: false, message: 'No active reservation round' })
    }

    const isValidUser = checkUserQualification(req.body.userYear, student_year)

    if (isValidUser) {
      res.status(200).json({ isEligible: true })
    } else {
      res.status(200).json({ isEligible: false, message: 'User does not meet the qualification criteria' })
    }
  } catch (error) {
    console.error('Error checking reservation qualification:', error.message)
    res.status(500).json({ error: 'Failed to check reservation qualification' })
  }
}

export default handler
