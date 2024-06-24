// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import TableCell, { TableCellProps, tableCellClasses } from '@mui/material/TableCell'
import { useEffect, useState } from 'react'
import TuneIcon from '@mui/icons-material/Tune'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import RenewalFormEdit from './renewalDormitoryTableEdit.'
import Typography from '@mui/material/Typography'

// Styled components
const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

interface RenewalData {
  id: number
  renewal_name: string
  start_date: string
  end_date: string
  status: boolean
}

const RenewalTable = () => {
  const [rows, setRows] = useState<RenewalData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data
        const response = await fetch('/api/admin/renewalDormitory/read/')
        const result = await response.json()
        setRows(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()

    const intervalId = setInterval(fetchData, 3000)

    return () => clearInterval(intervalId)
  }, [])

  console.log(rows)

  const formatDate = (dateString: string) => {
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' }

    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label='customized table'>
        <TableHead>
          <TableRow>
            <StyledTableCell>Renewal Name</StyledTableCell>
            <StyledTableCell align='right'>Start Date</StyledTableCell>
            <StyledTableCell align='right'>End Date</StyledTableCell>
            <StyledTableCell align='right'>Round Status</StyledTableCell>
            <StyledTableCell align='right'>Edit</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
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
                    <Typography variant='body2'>Renewal Period Not Found</Typography>
                  </div>
                </Paper>
              </TableCell>
            </TableRow>
          ) : (
            rows.map(row => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component='th' scope='row'>
                  Semester {row.renewal_phase}, {row.renewal_name}
                </StyledTableCell>
                <StyledTableCell align='right'>{formatDate(row.start_date)}</StyledTableCell>
                <StyledTableCell align='right'>{formatDate(row.end_date)}</StyledTableCell>
                <StyledTableCell align='right'>
                  {row.status ? (
                    <Chip label='อยู่ในช่วงเวลา' color='success' />
                  ) : (
                    <Chip label='ไม่อยู่ในช่วงเวลา' sx={{ backgroundColor: 'red', color: 'white' }} />
                  )}
                </StyledTableCell>
                <StyledTableCell align='right'>
                  <RenewalFormEdit id={row.id}>
                    <Button>
                      <TuneIcon />
                    </Button>
                  </RenewalFormEdit>
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RenewalTable
