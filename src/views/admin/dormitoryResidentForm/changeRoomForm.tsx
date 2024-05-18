// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react'

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
import Button from '@mui/material/Button'
import EditChangeRoom from './editChangeRoomForm'

interface Column {
  id: 'ประทับเวลา' | 'StudentID' | 'Username' | 'Building' | 'Room' | 'Bed' | 'topic' | 'status'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'StudentID', label: 'Student ID', minWidth: 100 },
  { id: 'Username', label: 'Username', minWidth: 170 },
  { id: 'topic', label: 'Topic', minWidth: 170 },
  { id: 'status', label: 'Status', minWidth: 170 },
  { id: 'option', label: 'Option', minWidth: 170 }
]

interface Data {
  ประทับเวลา: string
  StudentID: string
  Username: string
  Building: string
  Room: string
  Bed: string
  status: string
  topic: string
  id: string
}

const ChangeRoomForm = () => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [rows, setRows] = useState<Data[]>([])
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        '/api/admin/dormitoryResident/dormitoryResidentForm/changeRoomForm/read/fetch_changeRoom'
      )
      const result = await response.json()
      const mappedData = result.data.map((item: any) => ({
        id: item.id,
        ประทับเวลา: item.Timestamp,
        StudentID: item.StudentID,
        Username: item.Username,
        Building: item.Building,
        Room: item.Room,
        Bed: item.Bed,
        status: item.status,
        topic: `ต้องการย้ายไปยัง ${item.Building} / ${item.Room} / ${item.Bed}`
      }))
      setRows(mappedData)
    }

    fetchData()
  }, [])

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const filteredRows = rows.filter(row => {
    if (tabValue === 0) {
      return row.status === ''
    } else if (tabValue === 1) {
      return row.status === 'success'
    } else if (tabValue === 2) {
      return row.status === 'reject'
    } else {
      return true
    }
  })

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Tabs value={tabValue} onChange={handleChangeTab}>
        <Tab label='Request' />
        <Tab label='Success' />
        <Tab label='Reject' />
      </Tabs>
      {tabValue === 0 && (
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
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.StudentID}>
                    {columns.map(column => {
                      const value = row[column.id]

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'status' && value === '' ? (
                            <Chip label='รอการย้ายห้อง' color='warning' />
                          ) : column.id === 'topic' ? (
                            <Chip label={value} color='primary' />
                          ) : column.id === 'option' ? (
                            <EditChangeRoom id={row.id} /> // Assuming StudentID is the id you want to pass
                          ) : column.format && typeof value === 'number' ? (
                            column.format(value)
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
      )}
      {/* Add the Success tab content here */}
      {tabValue === 1 && (
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map(
                  column =>
                    column.id !== 'option' && (
                      <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.StudentID}>
                    {columns.map(column => {
                      const value = row[column.id]

                      return (
                        column.id !== 'option' && (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'status' && value === 'success' ? (
                              <Chip label='ย้ายห้องเสร็จสิ้น' color='success' />
                            ) : column.id === 'topic' ? (
                              <Chip label={value} color='primary' />
                            ) : column.id === 'option' ? (
                              <EditChangeRoom id={row.id} /> // Assuming StudentID is the id you want to pass
                            ) : column.format && typeof value === 'number' ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </TableCell>
                        )
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add the Reject tab content here */}
      {tabValue === 2 && (
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map(
                  column =>
                    column.id !== 'option' && (
                      <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.StudentID}>
                    {columns.map(column => {
                      const value = row[column.id]

                      return (
                         column.id !== 'option' && (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'status' && value === 'reject' ? (
                            <Chip label='ปฏิเสธการย้ายห้อง' color='error' />
                          ) : column.id === 'topic' ? (
                            <Chip label={value} color='primary' />
                          ) : column.id === 'option' ? (
                            <EditChangeRoom id={row.id} /> // Assuming StudentID is the id you want to pass
                          ) : column.format && typeof value === 'number' ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      )
                    )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default ChangeRoomForm