import jwt from 'jsonwebtoken'

export default function middleware(req: any, res: any, next: any) {
  const authHeader = req?.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    req.user = decoded
  })
  next() // Call next to pass control to the next middleware in the chain
}
