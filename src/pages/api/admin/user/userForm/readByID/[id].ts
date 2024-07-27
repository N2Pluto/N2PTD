// this is /api/admin/user/userForm/read/readByID/[id].ts
import { google } from 'googleapis'

const handler = async (req: any, res: any) => {
  const id = Number(req.query.id)
  console.log('id', id)
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

    const keysRange = `Form_EditProfile!A1:N1`
    const keysResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: keysRange
    })
    const keys = keysResponse.data.values[0]

    const valuesRange = `Form_EditProfile!A${rowNumber}:N${rowNumber}`
    const valuesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: valuesRange
    })
    const values = valuesResponse.data.values[0]

    // const defaultData = {
    //   status: undefined,
    //   'Email Address': undefined,
    //   username: undefined,
    //   StudentID: undefined,
    //   name: undefined,
    //   lastname: undefined,
    //   student_id: undefined,
    //   school: undefined,
    //   department: undefined,
    //   major: undefined,
    //   gender: undefined,
    //   phone: undefined,
    //   religion: undefined
    // }

    // const data = keys.reduce((obj, key, i) => ({ ...obj, [key]: values[i] || defaultData[key] }), {})

    // console.log(data)

    // res.status(200).json({ data })
    res.status(200).json({  })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default handler
