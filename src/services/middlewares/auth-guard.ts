import jwt from 'jsonwebtoken'

export const authGuard = (req: any, res: any) => {
  const authHeader = req?.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  console.log('token ', token)
  jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    console.log('decoded', decoded)

    return decoded
  })
}
