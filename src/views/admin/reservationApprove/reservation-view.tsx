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
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import { CiMenuKebab } from 'react-icons/ci'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { MdCancel } from 'react-icons/md'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import SearchIcon from '@mui/icons-material/Search'

interface User {
  id: number
  dorm_id: number
  room_id: number
  bed_id: number
  user_id: string
  round_id: number
  status: string
  created_at: string
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

const ReservationApprove = () => {
  const [users, setUsers] = React.useState<User[]>([])
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof User>('id')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [tab, setTab] = React.useState('all')
  const [selectValue, setSelectValue] = React.useState('')
  const [searchValue, setSearchValue] = React.useState('')
  const [roundNames, setRoundNames] = React.useState<string[]>([])
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>([])

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedRoundId = event.target.value as number
    console.log('selectedRoundId', selectedRoundId)
    if (selectedRoundId === -1) {
      // If "All" is selected, fetch all users
      setFilteredUsers(users)
    } else {
      // If a specific round is selected, filter users
      const filtered = users.filter(user => user.round_id === selectedRoundId)
      setFilteredUsers(filtered)
    }
    setSelectValue(event.target.value as string)
  }

  useEffect(() => {
    if (selectValue === '-1') {
      setFilteredUsers(users)
    } else {
      const selectedRoundId = Number(selectValue)
      const filtered = users.filter(user => user.round_id === selectedRoundId)
      setFilteredUsers(filtered)
    }
  }, [users, selectValue])

  useEffect(() => {
    handleSelectChange({ target: { value: '-1' } } as React.ChangeEvent<{ value: unknown }>)
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/reservationApprove/read/fetch_UserReservation')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data) {
        setUsers(data)
        const uniqueRoundIds = Array.from(new Set(data.map((user: User) => user.round_id)))
        const uniqueRoundNames = uniqueRoundIds.map(id => {
          const user = data.find((user: User) => user.round_id === id)

          return { round_name: user.Reservation_System.round_name, round_id: user.round_id }
        })
        setRoundNames(uniqueRoundNames)
      } else {
        console.error('No data returned from API')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }
  useEffect(() => {
    const intervalId = setInterval(fetchData, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSearchValue(event.target.value as string)
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setTab(newValue)
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClickOption = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const resetSelected = () => {
    setSelected([])
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredUsers.map(n => n.id)
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

  // Use filteredUsers instead of users
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0

  const filteredUsersByTab = filteredUsers.filter(user => {
    switch (tab) {
      case 'pending':
        return user.status === 'Pending'
      case 'approve':
        return user.status === 'Approve'
      case 'eject':
        return user.status === 'Eject'
      default:
        return true
    }
  })

  const visibleRows = React.useMemo(() => {
    const lowerCaseSearchValue = searchValue.toLowerCase()

    const filteredUsersBySearch = filteredUsersByTab.filter(user =>
      `${user.Users_Info?.name} ${user.Users_Info?.lastname}`.toLowerCase().includes(lowerCaseSearchValue)
    )

    return stableSort(filteredUsersBySearch, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
  }, [order, orderBy, page, rowsPerPage, filteredUsersByTab, searchValue])

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleApprove = async (id: number) => {
    const response = await fetch('/api/admin/reservationApprove/update/updateApprove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, status: 'Approve' })
    })

    if (!response.ok) {
      console.error('Failed to update reservation status')
    }
  }

  const handleEject = async (id: number) => {
    const response = await fetch('/api/admin/reservationApprove/update/updateApprove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, status: 'Eject' })
    })

    if (!response.ok) {
      console.error('Failed to update reservation status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning'
      case 'Eject':
        return 'error'
      case 'Approve':
        return 'success'
      default:
        return 'default'
    }
  }

  const allCount = filteredUsers.length
  const pendingCount = filteredUsers.filter(user => user.status === 'Pending').length
  const approveCount = filteredUsers.filter(user => user.status === 'Approve').length
  const ejectCount = filteredUsers.filter(user => user.status === 'Eject').length

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tab} onChange={handleTabChange} aria-label='reservation status tabs'>
        <Tab
          label={
            <span
              style={{ color: tab === 'all' ? 'black' : undefined, fontWeight: tab === 'all' ? 'bold' : undefined }}
            >
              ALL{' '}
              <span style={{ backgroundColor: '#36454F', padding: '4px 8px', borderRadius: '5px', color: 'white' }}>
                {' '}
                {allCount}{' '}
              </span>
            </span>
          }
          value='all'
        />
        <Tab
          label={
            <span
              style={{
                color: tab === 'approve' ? 'black' : undefined,
                fontWeight: tab === 'approve' ? 'bold' : undefined
              }}
            >
              Approve{' '}
              <span style={{ backgroundColor: '#b8ffb8', padding: '4px 8px', borderRadius: '5px' }}>
                {' '}
                {approveCount}{' '}
              </span>
            </span>
          }
          value='approve'
        />
        <Tab
          label={
            <span
              style={{
                color: tab === 'pending' ? 'black' : undefined,
                fontWeight: tab === 'pending' ? 'bold' : undefined
              }}
            >
              Pending{' '}
              <span style={{ backgroundColor: '#ffffba', padding: '4px 8px', borderRadius: '5px' }}>
                {' '}
                {pendingCount}{' '}
              </span>
            </span>
          }
          value='pending'
        />
        <Tab
          label={
            <span
              style={{
                color: tab === 'eject' ? 'black' : undefined,
                fontWeight: tab === 'eject' ? 'bold' : undefined
              }}
            >
              Eject{' '}
              <span style={{ backgroundColor: '#ffabab', padding: '4px 8px', borderRadius: '5px' }}>
                {' '}
                {ejectCount}{' '}
              </span>
            </span>
          }
          value='eject'
        />
      </Tabs>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: 5 }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id='form-layouts-separator-select-label'>Round</InputLabel>
            <Select
              label='Round'
              defaultValue='-1'
              id='form-layouts-separator-select'
              labelId='form-layouts-separator-select-label'
              onChange={handleSelectChange}
            >
              <MenuItem value='-1'>รอบจองหอพักทั้งหมด</MenuItem>
              {roundNames.map(round => (
                <MenuItem value={round.round_id}>{round.round_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label='Search'
            placeholder='Leonard Carter'
            value={searchValue}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, marginLeft: 2 }}
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
              rowCount={filteredUsers.length}
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
                      {row.id}
                    </TableCell>
                    <TableCell>
                      {row.Users_Info?.name} {row.Users_Info?.lastname}
                    </TableCell>
                    <TableCell>{row.Dormitory_Building.name}</TableCell>
                    <TableCell>{row.Dormitory_Room.room_number}</TableCell>
                    <TableCell>{row.Dormitory_Bed.bed_number}</TableCell>
                    <TableCell>{row.Reservation_System.round_name}</TableCell>
                    <TableCell>
                      <Chip label={row.status} color={getStatusColor(row.status)} />
                    </TableCell>
                    <TableCell>{formatDate(row.created_at)}</TableCell>
                    <TableCell align='left'>
                      <Button
                        variant='outlined'
                        color='error'
                        size='small'
                        sx={{ minWidth: '30px', marginRight: '10px' }}
                        onClick={event => {
                          event.stopPropagation()
                          handleEject(row.id)
                        }}
                      >
                        <CloseIcon color='error' />
                      </Button>
                      <Button
                        variant='outlined'
                        color='success'
                        size='small'
                        sx={{ minWidth: '30px' }}
                        onClick={event => {
                          event.stopPropagation()
                          handleApprove(row.id)
                        }}
                      >
                        <CheckIcon color='success' />
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label='Dense' />
    </Box>
  )
}

export default ReservationApprove
