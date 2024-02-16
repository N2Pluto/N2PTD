import middleware from '../middleware'

function handler(req: any, res: any) {
  middleware(req, res, () => {
    console.log('user', req.user)
    res.status(200).json({ message: req.user })
  })
}

export default handler
