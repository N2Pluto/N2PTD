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
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import TuneIcon from '@mui/icons-material/Tune'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import EditUserForm from './editUserForm'

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
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [rows, setRows] = useState<any[]>([])
  const [tabValue, setTabValue] = useState(0)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch(`/api/admin/user/userForm/read/fetch_form`).then(res => res.json())
        if (data) {
          setRows(data) // Corrected line
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

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
    // Added
    setTabValue(newValue)
  }

  const filteredRows = rows.filter(row => {
    if (tabValue === 0) {
      return row.status === ''
    } else if (tabValue === 1) {
      return row.status === 'successfully'
    } else {
      return true
    }
  })

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Tabs value={tabValue} onChange={handleTabChange}>
        {' '}
        <Tab label='Request' />
        <Tab label='Successfully' />
      </Tabs>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows &&
              filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.student_id}>
                    {columns.map(column => {
                      const value = row[column.id]

                      return (
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
                              <Chip label='รอการแก้ไข' style={{ backgroundColor: '#F1AB3D', color: '#FFFFFF' }} /> // Pantone 178 C />
                            ) : value === 'successfully' ? (
                              <Chip
                                label='แก้ไขข้อมูลสำเร็จ'
                                style={{ backgroundColor: '#4caf50', color: '#FFFFFF' }}
                              /> // Success color
                            ) : null
                          ) : column.id === 'edit' ? (
                            row.status === '' ? (
                              <EditUserForm id={row.id} student_id={row.StudentID} />
                            ) : null
                          ) : (
                            value
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
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
