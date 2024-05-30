// this is /api/admin/dormitoryResident/dormitoryResidentForm/transferForm/read/fetch_transferRoom.ts
import { google } from 'googleapis'

const handler = async (req: any, res: any) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
      ]
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Form_TransferRoom!A1:K50'
    })

    const [header, ...rows] = response.data.values
    const data = rows.map((row, index) => {
      const obj = header.reduce((obj, key, i) => ({ ...obj, [key]: row[i] || '' }), {})

      return { id: index, ...obj }
    })

    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
