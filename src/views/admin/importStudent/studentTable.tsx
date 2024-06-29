import { useState, useEffect, ChangeEvent } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import ImportStudent from './importStudent'
import UpdateStudentYear from './updateStudentYear'

const columns = [
  { id: 'student_id', label: 'Student ID', minWidth: 120 },
  { id: 'name', label: 'Full Name', minWidth: 200 },
  { id: 'school', label: 'School', minWidth: 170 },
  { id: 'department', label: 'Department', minWidth: 170 },
  { id: 'major', label: 'Major', minWidth: 170 },
  { id: 'gender', label: 'Gender', minWidth: 120 },
  { id: 'religion', label: 'Religion', minWidth: 120 },
  { id: 'phone', label: 'Phone', minWidth: 120 }
]

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 440,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1]
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

const StudentTable = () => {
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const [schoolFilter, setSchoolFilter] = useState<string>('')
  const [nameFilter, setNameFilter] = useState<string>('')
  const [genderFilter, setGenderFilter] = useState<string>('')
  const [studentIDPrefixFilter, setStudentIDPrefixFilter] = useState<string>('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerUpdateOpen, setDrawerUpdateOpen] = useState(false)
  const [selected, setSelected] = useState<number[]>([])

  const handleDelete = async () => {
    console.log('Delete selected students:', selected)
    try {
      const response = await fetch('/api/admin/student/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selected })
      })

      if (!response.ok) {
        throw new Error('Failed to delete students')
      }

      const remainingRows = rows.filter(row => !selected.includes(row.student_id))
      setRows(remainingRows)
      setFilteredRows(remainingRows)
      setSelected([])
    } catch (error) {
      console.error('Error deleting students:', error)
    }
  }

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/admin/student/read')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          const formattedData = data.map(student => ({
            student_id: student.student_id,
            name: `${student.name} ${student.lastname}`,
            school: student.school || '',
            department: student.department || '',
            major: student.major || '',
            gender: student.gender,
            phone: student.phone,
            religion: student.religion
          }))
          setRows(formattedData)
          setFilteredRows(formattedData)
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error)
        })
    }

    fetchData() // Fetch data immediately on component mount
    const intervalId = setInterval(fetchData, 5000) // Fetch data every 5 seconds

    return () => clearInterval(intervalId) // Clear interval on component unmount
  }, [])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleSchoolFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSchoolFilter(event.target.value)
  }

  const handleNameFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value)
  }

  const handleGenderFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGenderFilter(event.target.value)
  }

  const handleStudentIDPrefixFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStudentIDPrefixFilter(event.target.value)
  }

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map(n => n.student_id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  useEffect(() => {
    let filtered = rows

    if (schoolFilter) {
      filtered = filtered.filter(row => row.school === schoolFilter)
    }

    if (nameFilter) {
      const lowercasedFilter = nameFilter.toLowerCase()
      filtered = filtered.filter(
        row => row.name.toLowerCase().includes(lowercasedFilter) || row.student_id.toString().includes(lowercasedFilter)
      )
    }

    if (genderFilter) {
      filtered = filtered.filter(row => row.gender === genderFilter)
    }

    if (studentIDPrefixFilter) {
      filtered = filtered.filter(row => row.student_id.toString().startsWith(studentIDPrefixFilter))
    }

    setFilteredRows(filtered)
  }, [schoolFilter, nameFilter, genderFilter, studentIDPrefixFilter, rows])

  const schoolOptions = Array.from(new Set(rows.map(row => JSON.stringify({ id: row.school, name: row.school })))).map(
    str => JSON.parse(str)
  )

  const studentIDPrefixes = Array.from(new Set(rows.map(row => row.student_id.toString().slice(0, 2))))

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ margin: 2 }}>
          <Typography variant='h5' sx={{ margin: 2 }}>
            Student List
          </Typography>

          {/* <Button variant='contained' color='primary' onClick={() => setDrawerUpdateOpen(true)} sx={{ ml: 200 }}>
            UPDATE STUDENT YEAR
          </Button> */}
          <Button variant='contained' color='primary' onClick={() => setDrawerOpen(true)}>
            IMPORT STUDENT
          </Button>
        </Box>

        <Grid container spacing={2} padding={2} sx={{ margin: 2 }}>
          <Grid item xs={2}>
            <TextField
              select
              label='Filter Student ID Prefix'
              value={studentIDPrefixFilter}
              onChange={handleStudentIDPrefixFilterChange}
              variant='outlined'
              fullWidth
              sx={{ ml: 5 }}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {studentIDPrefixes.sort().map(prefix => (
                <MenuItem key={prefix} value={prefix}>
                  {prefix}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={2}>
            <TextField
              select
              label='Filter by School'
              value={schoolFilter}
              onChange={handleSchoolFilterChange}
              variant='outlined'
              fullWidth
              sx={{ ml: 5 }}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {schoolOptions.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={2}>
            <TextField
              select
              label='Filter by Gender'
              value={genderFilter}
              onChange={handleGenderFilterChange}
              variant='outlined'
              sx={{ ml: 5 }}
              fullWidth
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value='male'>Male</MenuItem>
              <MenuItem value='female'>Female</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={5.5}>
            <TextField
              label='Filter by Name or Student ID'
              value={nameFilter}
              onChange={handleNameFilterChange}
              variant='outlined'
              sx={{ ml: 5 }}
              fullWidth
            />
          </Grid>
        </Grid>
        {selected.length > 0 && (
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            sx={{
              padding: 2,
              backgroundColor: 'rgba(255, 192, 203, 0.5)'
            }}
          >
            <Typography variant='subtitle1'>
              Selected {selected.length} {selected.length === 1 ? 'student' : 'students'}
            </Typography>
            <IconButton color='secondary' onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
        <StyledTableContainer>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <StyledTableCell padding='checkbox'>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                    checked={filteredRows.length > 0 && selected.length === filteredRows.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all students' }}
                  />
                </StyledTableCell>
                {columns.map(column => (
                  <StyledTableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                    {column.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length > 0 ? (
                filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  const isItemSelected = selected.indexOf(row.student_id) !== -1

                  return (
                    <StyledTableRow hover role='checkbox' tabIndex={-1} key={row.student_id}>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          checked={isItemSelected}
                          onChange={event => handleClick(event, row.student_id)}
                          inputProps={{ 'aria-labelledby': `checkbox-${row.student_id}` }}
                        />
                      </TableCell>
                      {columns.map(column => {
                        const value = row[column.id]
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        )
                      })}
                    </StyledTableRow>
                  )
                })
              ) : (
                <TableRow style={{ height: 100 }}>
                  <TableCell colSpan={columns.length + 1}>
                    {' '}
                    {/* Adjusted colspan to match the number of columns + checkbox column */}
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
                        <Typography variant='body2'>Data Not Found</Typography>
                      </div>
                    </Paper>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #e0e0e0' }}
        />
      </Paper>
      <ImportStudent drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </>
  )
}

export default StudentTable
