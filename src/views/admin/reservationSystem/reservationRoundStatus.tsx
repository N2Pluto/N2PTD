import * as React from 'react'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import TuneIcon from '@mui/icons-material/Tune'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import DeleteRound from './reservationRoundForm'

interface Round {
  id: number
  round_name: string
  start_date: string
  end_date: string
  student_year: string
  gender : string
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: 'center' // ให้ text ทุก cell ใน header อยู่ตรงกลาง
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: 'center' // ให้ text ทุก cell ใน body อยู่ตรงกลาง
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))


export default function ReservationRoundStatus() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    const fetchRoundStatus = async () => {
      const response = await fetch('/api/admin/reservationSystem/read/fetchRoundStatus')
      const data = await response.json()
      setRows(data)
    }

    fetchRoundStatus()
    
    const intervalId = setInterval(fetchRoundStatus, 5000)

    return () => clearInterval(intervalId)
  }, [])


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label='customized table'>
        <TableHead>
          <TableRow>
            <StyledTableCell>Round Name</StyledTableCell>
            <StyledTableCell>Start Date</StyledTableCell>
            <StyledTableCell>End Date</StyledTableCell>
            {/* <StyledTableCell>Gender</StyledTableCell> */}
            <StyledTableCell>Student Year</StyledTableCell>
            <StyledTableCell>Round Status</StyledTableCell>
            <StyledTableCell>Option</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{row.round_name}</StyledTableCell>
              <StyledTableCell>{new Date(row.start_date).toLocaleDateString('en-US')}</StyledTableCell>
              <StyledTableCell>{new Date(row.end_date).toLocaleDateString('en-US')}</StyledTableCell>
              {/* <StyledTableCell>{row.gender}</StyledTableCell> */}
              <StyledTableCell>{row.student_year}</StyledTableCell>
              <StyledTableCell>
                {row.round_status ? (
                  <Chip label='อยู่ในช่วงเวลา' color='success' />
                ) : (
                  <Chip label='ไม่อยู่ในช่วงเวลา' sx={{ backgroundColor: 'red', color: 'white' }} />
                )}
              </StyledTableCell>
              <StyledTableCell>
                <DeleteRound id={row.id}>
                  <Button>
                    <TuneIcon />
                  </Button>
                </DeleteRound>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
