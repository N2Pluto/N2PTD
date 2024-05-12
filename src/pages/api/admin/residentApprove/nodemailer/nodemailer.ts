// this is /api/admin/residentApprove/nodemailer/nodemailer.ts
import nodemailer from 'nodemailer'

const email = process.env.EMAIL
const pass = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: pass
  }
})

export default async function handler(req: any, res: any) {
  const { to, subject, text } = req.body
  console.log(req.body)

  const mailOptions = {
    from: email,
    to: to,
    subject: subject,
    html: req.body.html
  }
  console.log(mailOptions)

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Email sent' })
  } catch (error) {
    console.error(`Error sending email: ${error}`)
    res.status(500).json({ error: 'Error sending email' })
  }
}
