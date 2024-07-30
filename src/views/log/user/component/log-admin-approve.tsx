import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import TableCell, { TableCellProps, tableCellClasses } from '@mui/material/TableCell'
import { Box, Grid, InputAdornment, TextField, TablePagination, FormControl, InputLabel, MenuItem } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import IosShareIcon from '@mui/icons-material/IosShare'

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
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

const createData = (id: number, content: string, admin_id: string, ip: string, time: string, type: string) => {
  return { id, content, admin_id, type, time, ip }
}

const LogsadminApprove = () => {
  const [searchValue, setSearchValue] = useState('')
  const [loguser, setLoguser] = useState<any>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [totalRows, setTotalRows] = useState(0)
  const [sortOrder, setSortOrder] = useState('newer')
  const [selectedType, setSelectedType] = useState('')

  const handleSearchChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSearchValue(event.target.value as string)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/log/admin/approve/select?page=${page + 1}&limit=${rowsPerPage}`)
        const result = await response.json()
        setLoguser(result.data)
        setTotalRows(result.count)
      } catch (error) {
        console.error('Error fetching log user reservation data:', error)
      }
    }

    fetchData()
  }, [page, rowsPerPage, searchValue])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSortOrder(event.target.value as string)
  }

  const handleSelectChangetype = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedType(event.target.value as string)
  }

  const exportToCSV = () => {
    const headers = ['Content', 'admin_id', 'ip', 'time', 'type']
    const rows = filteredLoguser.map((log: any) => [log.content, log.admin_id, log.ip, log.time, log.type])

    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += headers.join(',') + '\n'
    rows.forEach((rowArray: any) => {
      const row = rowArray.join(',')
      csvContent += row + '\n'
    })

    const encodedUri = encodeURI(csvContent)
    const fileName = `log_admin_controlbuilding_${selectedType ? `_${selectedType}` : ''}.csv`
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredLoguser = loguser
    .filter((log: any) => log.admin_id.toLowerCase().includes(searchValue.toLowerCase()))
    .filter((log: any) => selectedType === '' || log.type === selectedType)
    .sort((a: any, b: any) =>
      sortOrder === 'newer'
        ? new Date(b.time).getTime() - new Date(a.time).getTime()
        : new Date(a.time).getTime() - new Date(b.time).getTime()
    )

  const rows = filteredLoguser.map((log: any) =>
    createData(log.log_id, log.content, log.admin_id, log.ip, log.time, log.type)
  )

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: '', margin: 5 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id='form-layouts-separator-select-label'>Round</InputLabel>
            <Select
              label='Time'
              value={sortOrder}
              id='form-layouts-separator-select'
              labelId='form-layouts-separator-select-label'
              onChange={handleSelectChange}
            >
              <MenuItem value='newer'>newer</MenuItem>
              <MenuItem value='older'>older</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box sx={{ paddingLeft: 5 }}>
            <FormControl fullWidth>
              <InputLabel id='form-layouts-separator-select-label'>Type</InputLabel>
              <Select
                label='Type'
                value={selectedType}
                id='form-layouts-separator-select'
                labelId='form-layouts-separator-select-label'
                onChange={handleSelectChangetype}
              >
                <MenuItem value=''>All</MenuItem>
                <MenuItem value='Resident'>Resident</MenuItem>
                <MenuItem value='Reservation'>Reservation</MenuItem>
                <MenuItem value='Renewal'>Renewal</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Search'
              placeholder='Student ID'
              value={searchValue}
              onChange={handleSearchChange}
              sx={{ flexGrow: 1, ml: 8 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={0.5}>
          <Box sx={{ flexGrow: 1, ml: 5 }}>
            <IconButton onClick={exportToCSV} sx={{ flexGrow: 1, ml: 8, mt: 2 }}>
              <IosShareIcon />
            </IconButton>
          </Box>
        </Grid>
      </Box>

      <Box sx={{ marginLeft: 10, marginRight: 10 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 200 }} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: '60%' }}>content</StyledTableCell>
                <StyledTableCell align='center'>ADMIN ID</StyledTableCell>
                <StyledTableCell align='center'>IP</StyledTableCell>
                <StyledTableCell align='center'>time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component='th' scope='row'>
                    {row.content}
                  </StyledTableCell>
                  <StyledTableCell align='center'>{row.admin_id}</StyledTableCell>
                  <StyledTableCell align='center'>{row.ip}</StyledTableCell>
                  <StyledTableCell align='center'>
                    {new Date(row.time).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePagination
        rowsPerPageOptions={[100, 200, 500, 1000]}
        component='div'
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  )
}

export default LogsadminApprove
