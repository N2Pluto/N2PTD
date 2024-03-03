// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import TableCell, { TableCellProps, tableCellClasses } from '@mui/material/TableCell'
import { Divider, Grid } from '@mui/material'
import { useEffect, useState } from 'react'

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

const UserControl = () => {

  const [user, setUser] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/userControl/fetch_user').then(res => res.json())
        setUser(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }
    fetchData()
  }, [ ])

  const createData = (email: string, STUDENT: string, name: string, lastname: string, phone: string,role:string) => {
    return { email, STUDENT, name, lastname, phone ,role}
  }

  const rows = user.map((u) => createData(u.email, u.student_id,u.name ,u.lastname, u.phone, u.role));

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{pl:3}}>
        {' '}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>email</StyledTableCell>
                <StyledTableCell align='right'>Student ID</StyledTableCell>
                <StyledTableCell align='right'>name</StyledTableCell>
                <StyledTableCell >Last name</StyledTableCell>
                <StyledTableCell align='right'>phone</StyledTableCell>
                <StyledTableCell align='right'>Role</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <StyledTableRow key={row.email}>
                  <StyledTableCell component='th' scope='row'>
                    {row.email}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{row.STUDENT}</StyledTableCell>
                  <StyledTableCell align='right'>{row.name}</StyledTableCell>
                  <StyledTableCell >{row.lastname}</StyledTableCell>
                  <StyledTableCell align='right'>{row.phone}</StyledTableCell>
                  <StyledTableCell align='right'>{row.role}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default UserControl
