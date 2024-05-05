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
import { useEffect } from 'react'
import { EnhancedTableHead } from './components/EnhancedTableHead'
import { descendingComparator, getComparator, stableSort } from './helpers/helper'
import { FaEdit } from 'react-icons/fa'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { alpha } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import SearchIcon from '@mui/icons-material/Search'
import MenuItem from '@mui/material/MenuItem'

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
}

interface EnhancedTableToolbarProps {
  numSelected: number
  selected: readonly number[]
  resetSelected: () => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, selected, resetSelected } = props
  console.log('numSelected', numSelected)
  console.log('selected', selected)

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
          Nutrition
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton>
            <DeleteIcon />
          </IconButton>
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

const DormitoryResidentControl = () => {
  const [users, setUsers] = React.useState<User[]>([])
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof User>('name')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [selectedDormitory, setSelectedDormitory] = React.useState(null)
  const [searchTerm, setSearchTerm] = React.useState('')
const [selectedFloor, setSelectedFloor] = React.useState<string | null>(null)

  // Add a function to handle changes to the search field
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const resetSelected = () => {
    setSelected([])
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch(`/api/admin/dormitoryResident/read/fetchResident`).then(res => res.json())
        if (data) {
          setUsers(data)
          console.log('fetchResident', data)
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    const intervalId = setInterval(fetchData, 5000) // Fetch data every 5 seconds

    return () => clearInterval(intervalId) // Clean up the interval on component unmount
  }, [])
  console.log(users)

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
    console.log(id)
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

  const visibleRows = React.useMemo(
    () =>
      stableSort(users, getComparator(order, orderBy))
        .filter(user => selectedFloor === null || user.Dormitory_Room.room_number.toString().startsWith(selectedFloor))
        .filter(user => selectedDormitory === null || user.dorm_id === selectedDormitory)
        .filter(user => {
          if (searchTerm.length <= 3) {
            return user.Dormitory_Room.room_number.toString().includes(searchTerm)
          } else if (!isNaN(Number(searchTerm))) {
            return user.Users?.student_id.includes(searchTerm)
          } else {
            return `${user.Users?.Users_Info[0]?.name} ${user.Users?.Users_Info[0]?.lastname}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          }
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, users, selectedDormitory, searchTerm]
  )

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const uniqueDormitories = [...new Set(users.map(user => user.dorm_id))]

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', margin: 5 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id='form-layouts-separator-select-label'>Round</InputLabel>
            <Select
              label='Round'
              defaultValue='-1'
              id='form-layouts-separator-select'
              labelId='form-layouts-separator-select-label'
            >
              <MenuItem value='-1' onClick={() => setSelectedDormitory(null)}>
                รายชื่อนักศึกษาทุกหอพัก
              </MenuItem>
              {uniqueDormitories.map(dorm_id => {
                const dormitoryName = users.find(user => user.dorm_id === dorm_id)?.Dormitory_Building.name
                return (
                  <MenuItem value={dorm_id} onClick={() => setSelectedDormitory(dorm_id)}>
                    {dormitoryName}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth sx={{ flexGrow: 1, marginLeft: 5, marginRight: 6 }}>
            <InputLabel id='form-layouts-separator-select-label'>Round</InputLabel>
            <Select
              label='Round'
              defaultValue='-1'
              id='form-layouts-separator-select'
              labelId='form-layouts-separator-select-label'
            >
              <MenuItem value='-1' onClick={() => setSelectedFloor(null)}>
                ทุกชั้น
              </MenuItem>
              <MenuItem value='1' onClick={() => setSelectedFloor('1')}>
                ชั้น 1
              </MenuItem>
              <MenuItem value='2' onClick={() => setSelectedFloor('2')}>
                ชั้น 2
              </MenuItem>
              <MenuItem value='3' onClick={() => setSelectedFloor('3')}>
                ชั้น 3
              </MenuItem>
              <MenuItem value='4' onClick={() => setSelectedFloor('4')}>
                ชั้น 4
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6.5}>
          <TextField
            fullWidth
            label='Search'
            placeholder='Leonard Carter'
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, marginLeft: 10, marginRight: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Box>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} resetSelected={resetSelected} />
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
              {visibleRows.map((row, index) => {
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
                      <Checkbox color='primary' checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                    </TableCell>
                    <TableCell component='th' id={labelId} scope='row' padding='none'>
                      {row.Users ? row.Users.student_id : ''}
                    </TableCell>
                    <TableCell>
                      {' '}
                      {row.Users?.Users_Info[0]?.name} {row.Users?.Users_Info[0]?.lastname}
                    </TableCell>
                    <TableCell>{row.Dormitory_Building.name}</TableCell>
                    <TableCell>{row.Dormitory_Room.room_number}</TableCell>
                    <TableCell>{row.Dormitory_Bed.bed_number}</TableCell>
                    <TableCell>{row.Reservation_System.round_name}</TableCell>
                    <TableCell align='right'>
                      <Button onClick={handleButtonClick}>
                        <FaEdit />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={9} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={users.length}
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

export default DormitoryResidentControl
