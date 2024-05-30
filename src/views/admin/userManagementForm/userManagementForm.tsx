// ** React Imports
import { useState, useEffect, ChangeEvent } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EditUserForm from './editUserForm'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'

const useStyles = makeStyles({
  success: {
    backgroundColor: '#4caf50'
  }
})

interface Column {
  id: string
  student_id: string
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'StudentID', label: 'Student ID', minWidth: 170 },
  { id: 'username', label: 'Name', minWidth: 170 },
  { id: 'topic', label: 'Topic', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'edit', label: 'Edit', minWidth: 100 }
]

const UserManagementForm = () => {
  // ** States
  const classes = useStyles()
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [rows, setRows] = useState<any[]>([])
  const [tabValue, setTabValue] = useState(0)
  const [open, setOpen] = useState(false)

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const handleUpdateSuccess = () => {
    setOpen(true)
  }

  const fetchData = async () => {
    try {
      const { data } = await fetch(`/api/admin/user/userForm/read/fetch_form`).then(res => res.json())
      if (data) {
        setRows(data) // Corrected line
        console.log('rows', data) // Moved console.log inside fetchData
      } else {
        console.error('No data returned from API')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  console.log('rows', rows)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue)
  }

  const filteredRows = rows.filter(row => {
    if (tabValue === 0) {
      return row.status === ''
    } else if (tabValue === 1) {
      return row.status === 'successfully'
    } else if (tabValue === 2) {
      return row.status === 'unsuccessfully'
    } else {
      return true
    }
  })

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label='Request' />
          <Tab label='Successfully' />
          <Tab label='Unsuccessfully' />
        </Tabs>
        <Button onClick={fetchData}>Refresh</Button>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(
                column =>
                  (tabValue === 0 || column.id !== 'edit') && (
                    <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Paper
                    style={{
                      // filter: 'grayscale(100%)',
                      padding: '20px',
                      width: '1350px',
                      height: '250px',
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
                        src='https://img5.pic.in.th/file/secure-sv1/problem-solve_14781806.png'
                        alt='No Data'
                        width='100'
                        height='100'
                        style={{ marginBottom: '10px' }}
                      />
                      <Typography variant='body2'>No Request Received</Typography>
                    </div>
                  </Paper>
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.student_id}>
                    {columns.map(column => {
                      if (tabValue !== 0 && column.id === 'edit') return null
                      const value = row[column.id]

                      return (
                        <>
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'topic' ? (
                              <>
                                <Box display='flex' gap={1} mb={1}>
                                  {row.student_id && (
                                    <Chip
                                      label='แก้ไขรหัสนักศึกษา'
                                      style={{ backgroundColor: '#0077B6', color: '#FFFFFF' }} // Pantone 286 C
                                    />
                                  )}
                                  {(row.name || row.lastname) && (
                                    <Chip
                                      label='แก้ไขชื่อ'
                                      style={{ backgroundColor: '#A8D1E7', color: '#FFFFFF' }} // Pantone 286 C
                                    />
                                  )}
                                  {(row.school || row.department || row.major) && (
                                    <Chip
                                      label='แก้ไขข้อมูลการศึกษา'
                                      style={{ backgroundColor: '#9DD2D8', color: '#FFFFFF' }} // Pantone Process Blue C
                                    />
                                  )}
                                  {row.gender && (
                                    <Chip
                                      label='แก้ไขเพศ'
                                      style={{ backgroundColor: '#FFBFC5', color: '#FFFFFF' }} // Pantone 3252 C
                                    />
                                  )}
                                </Box>
                                <Box display='flex' gap={1}>
                                  {row.phone && (
                                    <Chip
                                      label='แก้ไขเบอร์โทรศัพท์'
                                      style={{ backgroundColor: '#EB8DB5', color: '#FFFFFF' }} // Pantone Yellow C
                                    />
                                  )}
                                  {row.religion && (
                                    <Chip
                                      label='แก้ไขศาสนา'
                                      style={{ backgroundColor: '#D4A3C4', color: '#FFFFFF' }} // Pantone 178 C
                                    />
                                  )}
                                </Box>
                              </>
                            ) : column.id === 'status' ? (
                              value === '' ? (
                                <Chip label='รอการแก้ไข' style={{ backgroundColor: '#F1AB3D', color: '#FFFFFF' }} /> // Pantone 178 C
                              ) : value === 'successfully' ? (
                                <Chip
                                  label='แก้ไขข้อมูลสำเร็จ'
                                  style={{ backgroundColor: '#4caf50', color: '#FFFFFF' }}
                                /> // Success color
                              ) : value === 'unsuccessfully' ? (
                                <Chip
                                  label='ข้อมูลไม่ถูกต้อง'
                                  style={{ backgroundColor: '#f44336', color: '#FFFFFF' }}
                                /> // Error color
                              ) : null
                            ) : column.id === 'edit' ? (
                              tabValue === 0 && row.status === '' ? (
                                <EditUserForm
                                  id={row.id}
                                  student_id={row.StudentID}
                                  onUpdateSuccess={handleUpdateSuccess}
                                />
                              ) : null
                            ) : (
                              value
                            )}
                          </TableCell>
                          <Snackbar
                            open={open}
                            autoHideDuration={5000}
                            onClose={handleSnackbarClose}
                            message={
                              <span>
                                <CheckCircleIcon
                                  fontSize='small'
                                  style={{ verticalAlign: 'middle', marginRight: '8px' }}
                                />
                                {'Update successful'}
                              </span>
                            }
                            action={
                              <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
                                <CloseIcon fontSize='small' />
                              </IconButton>
                            }
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            ContentProps={{ className: classes.success }}
                          />
                        </>
                      )
                    })}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows ? rows.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default UserManagementForm
