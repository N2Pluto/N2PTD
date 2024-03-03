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

const createData = (email: string, calories: number, fat: number, carbs: number, protein: number) => {
  return { email, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
]

const UserControl = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{pl:3}}>
        {' '}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell>Dessert (100g serving)</StyledTableCell>
                <StyledTableCell align='right'>Calories</StyledTableCell>
                <StyledTableCell align='right'>Fat (g)</StyledTableCell>
                <StyledTableCell align='right'>Carbs (g)</StyledTableCell>
                <StyledTableCell align='right'>Protein (g)</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <StyledTableRow key={row.email}>
                  <StyledTableCell component='th' scope='row'>
                    {row.email}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{row.calories}</StyledTableCell>
                  <StyledTableCell align='right'>{row.fat}</StyledTableCell>
                  <StyledTableCell align='right'>{row.carbs}</StyledTableCell>
                  <StyledTableCell align='right'>{row.protein}</StyledTableCell>
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
