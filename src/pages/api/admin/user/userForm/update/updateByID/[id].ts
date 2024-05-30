// this is /api/admin/user/userForm/update/updateByID/[id].ts
import { google } from 'googleapis'

const handler = async (req: any, res: any) => {
  const { id, rowNumber } = req.body
  console.log('Received id:', id)

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
    console.log('rowNumber', rowNumber)

    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Form_EditProfile!A${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [['successfully']]
      }
    })

    console.log('updateResponse', updateResponse.data)

    res.status(200).json({ updateResponse })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
