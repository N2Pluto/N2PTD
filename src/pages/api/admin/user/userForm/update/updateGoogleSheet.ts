// // this is /api/admin/user/userForm/update/updateGoogleSheet.ts
// import { google } from 'googleapis'

// const handler = async (req: any, res: any) => {
//   try {
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
//       },
//       scopes: [
//         'https://www.googleapis.com/auth/spreadsheets',
//         'https://www.googleapis.com/auth/drive',
//         'https://www.googleapis.com/auth/drive.file'
//       ]
//     })

//     const sheets = google.sheets({ version: 'v4', auth })

//     // Ensure the row number is greater than 0
//     const rowNumber = Number(req.query.id)
//     console.log('rowNumber', rowNumber)

//     // Update the Google Sheet
//     const response = await sheets.spreadsheets.values.update({
//       spreadsheetId: process.env.GOOGLE_SHEET_ID,
//       range: `การตอบแบบฟอร์ม 1!A${rowNumber}`,
//       valueInputOption: 'USER_ENTERED',
//       resource: {
//         values: [['success']]
//       }
//     })

//     res.status(200).json({ data: response.data })
//     console.log('response', response.data)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }

// export default handler
