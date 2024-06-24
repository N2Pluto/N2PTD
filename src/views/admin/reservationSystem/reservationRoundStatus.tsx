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
import Typography from '@mui/material/Typography'

interface Round {
  id: number
  round_name: string
  start_date: string
  end_date: string
  student_year: string
  gender: string
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
          {rows.length > 0 ? (
            rows.map(row => (
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
            ))
          ) : (
            <TableRow style={{ height: 100 }}>
              <TableCell colSpan={11}>
                <Paper
                  style={{
                    padding: '20px',
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'rgba(128, 128, 128, 0.05)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}
                  >
                    <img
                      src='https://img5.pic.in.th/file/secure-sv1/erase_1981540.png'
                      alt='No Data'
                      width='100'
                      height='100'
                      style={{ marginBottom: '10px' }}
                    />
                    <Typography variant='body2'>Booking Period Not Found</Typography>
                  </div>
                </Paper>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
