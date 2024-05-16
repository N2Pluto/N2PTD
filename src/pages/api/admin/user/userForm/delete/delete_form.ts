// this is /api/admin/user/userForm/delete/delete_form.ts

const handler = async (req: any, res: any) => {
  for (let id = 1; id <= 14; id++) {
    const response = await fetch(
      `https://api.sheety.co/de2844df875ac66d708994514c0c46ff/wu :DormitoryDataCorrectorReport  (การตอบกลับ)/การตอบแบบฟอร์ม1/${id}`,
      { method: 'DELETE' }
    )
    const data = await response.json()
    res.json(data)
  }
}

export default handler
