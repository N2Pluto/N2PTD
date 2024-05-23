import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { useEffect, useState } from 'react'
import { EnhancedTableHead } from './components/EnhancedTableHead'
import { descendingComparator, getComparator, stableSort } from './helpers/helper'
import { FaEdit } from 'react-icons/fa'
import Button from '@mui/material/Button'
import EditUser from './editUser'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { alpha } from '@mui/material/styles'
import DeleteUser from './deleteUser'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import { Parser } from 'json2csv' // Import json2csv

interface User {
  id: number
  name: string
  lastname: string
  student_year: string
  school: string
  department: string
  major: string
  religion: string
  gender: string
  phone: string
  Users?: { student_id: string }
}

interface EnhancedTableToolbarProps {
  numSelected: number
  selected: readonly number[]
  resetSelected: () => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, selected, resetSelected } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
          User Management
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <DeleteUser selected={selected} resetSelected={resetSelected}>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </DeleteUser>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<keyof User>('student_id')
  const [selected, setSelected] = useState<readonly number[]>([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [schoolFilter, setSchoolFilter] = useState(-1)
  const [yearFilter, setYearFilter] = useState(-1)
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClickCSV = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseCSV = () => {
    setAnchorEl(null)
  }

  const handleExportCSV = () => {
    const dataToExport = filteredUsers.map(user => ({
      student_id: user.Users?.student_id,
      name: user.name,
      lastname: user.lastname,
      school: user.school,
      department: user.department,
      major: user.major,
      gender: user.gender,
      religion: user.religion,
      phone: user.phone
    }))
    const parser = new Parser()
    const csv = parser.parse(dataToExport)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'WU_UserInformation.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    handleCloseCSV()
  }

  const resetSelected = () => {
    setSelected([])
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch(`/api/admin/user/read/fetch_user`).then(res => res.json())
        if (data) {
          setUsers(Array.isArray(data) ? data : [data])
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    const intervalId = setInterval(fetchData, 3000)

    return () => clearInterval(intervalId)
  }, [])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = users.map(n => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (id: number) => selected.indexOf(id) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSchoolFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSchoolFilter(event.target.value as number)
  }

  const handleYearFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setYearFilter(event.target.value as number)
  }

  const filteredUsers = users.filter(user => {
    const matchesSchool = schoolFilter === -1 || user.school === schoolFilter
    const matchesYear = yearFilter === -1 || user.student_year === yearFilter
    const matchesSearchTerm =
      searchTerm.length === 0 ||
      (searchTerm.match(/^\d+$/)
        ? user.Users?.student_id.includes(searchTerm)
        : `${user.name} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSchool && matchesYear && matchesSearchTerm
  })

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredUsers, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredUsers]
  )

  const uniqueSchools = Array.from(new Set(users.map(user => user.school)))
  const uniqueYears = Array.from(new Set(users.map(user => user.student_year)))

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} resetSelected={resetSelected} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: 5 }}>
          <Grid item xs={12} sm={2.5}>
            <FormControl fullWidth sx={{ flexGrow: 1, ml: 3 }}>
              <InputLabel id='form-layouts-separator-select-label'>School</InputLabel>
              <Select
                label='School'
                value={schoolFilter}
                onChange={handleSchoolFilterChange}
                id='form-layouts-separator-select'
                labelId='form-layouts-separator-select-label'
              >
                <MenuItem value={-1}>All Schools</MenuItem>
                {uniqueSchools.map((school, index) => (
                  <MenuItem key={index} value={school}>
                    {school}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth sx={{ flexGrow: 1, ml: 5 }}>
              <InputLabel id='form-layouts-separator-select-label'>Student Year</InputLabel>
              <Select
                label='Student Year'
                value={yearFilter}
                onChange={handleYearFilterChange}
                id='form-layouts-separator-select'
                labelId='form-layouts-separator-select-label'
              >
                <MenuItem value={-1}>All Years</MenuItem>
                {uniqueYears.map((year, index) => (
                  <MenuItem key={index} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={7}>
            <TextField
              fullWidth
              label='Search User'
              placeholder='Leonard Carter'
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ flexGrow: 1, ml: 7 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AccountOutline />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={0.5}>
            <IconButton sx={{ flexGrow: 1, ml: 8, mt: 2 }} onClick={handleClickCSV}>
              <MoreVertIcon />
            </IconButton>
            <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseCSV}>
              <MenuItem onClick={handleExportCSV}>
                <img
                  src='https://img5.pic.in.th/file/secure-sv1/csv-file-format-extension_28842.png'
                  width='25'
                  height='25'
                  alt='CSV Icon'
                  style={{ marginRight: '10px' }}
                />
                <div>
                  <Typography variant='subtitle1'>Export</Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Exporting CSV data.
                  </Typography>
                </div>
              </MenuItem>
            </Menu>
          </Grid>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={users.length}
            />
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow style={{ height: 53 * rowsPerPage }}>
                  <TableCell colSpan={11}>
                    <Paper
                      style={{
                        // filter: 'grayscale(100%)',
                        padding: '20px',
                        width: '1350px',
                        height: '350px',
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
                          // style={{ filter: 'grayscale(100%)' }}
                        />
                        <Typography variant='body2'>Data Not Found</Typography>
                      </div>
                    </Paper>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.id)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='primary'
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell id={labelId}>
                        <Typography variant='body2'>{row.Users ? row.Users.student_id : ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>
                          {row.name} {row.lastname}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{row.school}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{row.department}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{row.major}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{row.religion}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{row.gender}</Typography>
                      </TableCell>
                      <TableCell align='left'>
                        <EditUser id={row.id}>
                          <Button onClick={handleButtonClick} sx={{ minWidth: 0, padding: 0 }}>
                            <FaEdit />
                          </Button>
                        </EditUser>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={11} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label='Dense padding' />
    </Box>
  )
}

export default UserManagement
