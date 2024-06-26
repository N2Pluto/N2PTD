// this is /api/admin/dormitoryResident/dormitoryResidentForm/changeRoomForm/read/[id].ts
import { google } from 'googleapis'

const handler = async (req: any, res: any) => {
  const id = Number(req.query.id)

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
    const rowNumber = id + 2

    const keysRange = `Form_ChangeRoom!A1:H1`
    const keysResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: keysRange
    })
    const keys = keysResponse.data.values[0]

    const valuesRange = `Form_ChangeRoom!A${rowNumber}:H${rowNumber}`
    const valuesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: valuesRange
    })
    const values = valuesResponse.data.values[0]

    const defaultData = {}

    const data = keys.reduce((obj, key, i) => ({ ...obj, [key]: values[i] || defaultData[key] }), {})

    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
