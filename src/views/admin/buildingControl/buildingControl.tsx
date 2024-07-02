// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'

const BuildingControl = () => {
  const [building, setBuilding] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/building/fetch_building').then(res => res.json())
        setBuilding(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }
    fetchData()
  }, [])

  const handleSelect = (id: string) => {
    router.push(`/admin/controlRoom/roomByID/${id}`)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Building name</TableCell>
            <TableCell>Building Type</TableCell>
            <TableCell>gender</TableCell>
            <TableCell align='center'>price </TableCell>
            <TableCell align='center'>room total </TableCell>
            <TableCell align='center'>detail </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {building.map(building => (
            <TableRow
              key={building.name}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row'>
                {building.name}
              </TableCell>
              <TableCell>{building.type_building}</TableCell>
              <TableCell>{building.type_gender}</TableCell>
              <TableCell align='center'>{building.price}</TableCell>
              <TableCell align='center'>{building.room_total}</TableCell>
              <TableCell align='center'>
                <Button variant='contained' onClick={() => handleSelect(building.dorm_id)}>
                  <Typography variant='button' style={{ color: 'white' }}>
                    Select
                  </Typography>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BuildingControl
