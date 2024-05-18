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
import MenuItem from '@mui/material/MenuItem'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import CSVReader from 'react-csv-reader'
import Papa from 'papaparse'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import SearchIcon from '@mui/icons-material/Search'
import FadeMenu from './components/FadeMenu'
import DialogReject from './reservation-reject'

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

const ResidentApprove = () => {
  const [users, setUsers] = React.useState<User[]>([])
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof User>('id')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [tab, setTab] = React.useState('Waiting')
  const [selectValue, setSelectValue] = React.useState('')
  const [searchValue, setSearchValue] = React.useState('')
  const [roundNames, setRoundNames] = React.useState<string[]>([])
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>([])
  const [selectedRound, setSelectedRound] = React.useState(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: function (results) {
          handleImportCSV(results.data)
        }
      })
    } else {
      console.log('No file selected')
    }
  }

  const handleImportCSV = async (data: any[]) => {
    // Assuming each row in the CSV is in the format [user_id, status]
    console.log('Imported CSV data:', data)

    const updatedUsers = [...users]
    data.forEach(({ user_id, status }) => {
      const userIndex = updatedUsers.findIndex(user => user.user_id === user_id)
      if (userIndex !== -1) {
        updatedUsers[userIndex].status = status
      }
    })
    setUsers(updatedUsers)
    console.log('updatedUsers', updatedUsers)

    // Make a POST request to the API endpoint with the updated users data
    const response = await fetch('/api/admin/residentApprove/update/updateResidentApprove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ updatedUsers })
    })

    if (!response.ok) {
      console.error('Failed to update users:', await response.text())
    }
  }

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
      const response = await fetch('/api/admin/residentApprove/read/fetchResidentApprove')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Data:', data)
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
      case 'Waiting':
        return user.status === 'Waiting'
      case 'TRUE':
        return user.status === 'TRUE'
      case 'FALSE':
        return user.status === 'FALSE'
      case 'SUCCESS':
        return user.status === 'SUCCESS'
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

  const handleApprove = async (id: number) => {
    console.log(`Button clicked with id: ${id}`)
    event.stopPropagation()

    // Call the API endpoint
    const response = await fetch('/api/admin/residentApprove/update/updateResident', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })

    if (!response.ok) {
      console.error('Failed to update reservation status')
      return
    } else {
      // Find the user
      const user = users.find(user => user.id === id)
      if (user) {
        // Send email to the user
        await fetch('/api/admin/reservationApprove/nodemailer/nodemailer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: user.Users.email,
            subject: 'คุณได้รับอนุมัติในการยืนยันตัวเข้าสู่หอพัก Walailak University',
            html: `
  <!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        direction: ltr; /* Set the writing direction to left-to-right */
        text-align: left; /* Align text to the left */
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333333;
        text-align: center;
        margin-top: 0;
      }
      p {
        line-height: 1.5;
        color: #555555;
        text-align: justify; /* Justify the text for better readability */
      }
      .button {
        display: inline-block;
        background-color: #007bff;
        color: #ffffff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to Walailak University Dormitory</h1>
      <p>Dear ${user.Users_Info.name} ${user.Users_Info.lastname},</p>
      <p>We are pleased to inform you that your application to reside in the Walailak University Dormitory has been approved. We are excited to welcome you to our community.</p>
      <p>Please find the details of your reservation below:</p>
      <ul>
        <li>Building: ${user.Dormitory_Building.name}</li>
        <li>Room: ${user.Dormitory_Room.room_number}</li>
        <li>Bed: ${user.Dormitory_Bed.bed_number}</li>
      </ul>
      <p>Should you have any questions or concerns, please do not hesitate to contact us.</p>
      <p>Sincerely,<br>Walailak University Dormitory</p>
    </div>
  </body>
</html>
`
          })
        })
      }
    }

    const result = await response.json()
    console.log(result.message)
  }

  const handleReject = async (id: number) => {
    event.stopPropagation()

    // Call the API endpoint
    const response = await fetch('/api/admin/residentApprove/delete/deleteResident', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })

    if (!response.ok) {
      console.error('Failed to delete reservation')

      return
    } else {
      // Find the user
      const user = users.find(user => user.id === id)
      if (user) {
        // Send email to the user
        await fetch('/api/admin/reservationApprove/nodemailer/nodemailer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: user.Users.email,
            subject: 'Reservation Denied',
            html: `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333333;
          text-align: center;
          margin-top: 0;
        }
        p {
          line-height: 1.5;
          color: #555555;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reservation Denied</h1>
        <p>Dear ${user.Users_Info.name} ${user.Users_Info.lastname},</p>
        <p>We regret to inform you that your reservation for the Walailak University Dormitory has been denied. This is due to the non-payment of the reservation confirmation fee within the specified timeframe.</p>
        <p>To proceed with your reservation, please make the necessary payment as soon as possible. You can find the payment details in your reservation confirmation email.</p>
        <p>If you have already made the payment and believe this is an error, please contact us immediately so we can investigate further.</p>
        <p>We apologize for any inconvenience this may cause.</p>
        <p>Sincerely,<br>Walailak University Dormitory</p>
      </div>
    </body>
  </html>
`
          })
        })
      }
    }

    const result = await response.json()
    console.log(result.message)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Waiting':
        return 'warning'
      case 'TRUE':
        return 'success'
      case 'FALSE':
        return 'error'
      case 'SUCCESS':
        return 'primary'
      default:
        return 'default'
    }
  }

  const waitingCount = filteredUsers.filter(user => user.status === 'Waiting').length
  const trueCount = filteredUsers.filter(user => user.status === 'TRUE').length
  const falseCount = filteredUsers.filter(user => user.status === 'FALSE').length
  const successCount = filteredUsers.filter(user => user.status === 'SUCCESS').length

  const exportToCSV = (roundId: number | null) => {
    const filteredUsers = users.filter(user => roundId === null || user.round_id === roundId)
    const csv = Papa.unparse(filteredUsers)
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const csvURL = window.URL.createObjectURL(csvData)
    let tempLink = document.createElement('a')
    tempLink.href = csvURL
    tempLink.setAttribute('download', `data_${roundId || 'all'}.csv`)
    tempLink.click()
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tab} onChange={handleTabChange} aria-label='reservation status tabs'>
        <Tab
          label={
            <span
              style={{
                color: tab === 'Waiting' ? 'black' : undefined,
                fontWeight: tab === 'Waiting' ? 'bold' : undefined
              }}
            >
              WAITING LIST{' '}
              <span style={{ backgroundColor: '#ffffba', padding: '4px 8px', borderRadius: '5px' }}>
                {' '}
                {waitingCount}{' '}
              </span>
            </span>
          }
          value='Waiting'
        />

        <Tab
          label={
            <span
              style={{
                color: tab === 'TRUE' ? 'black' : undefined,
                fontWeight: tab === 'TRUE' ? 'bold' : undefined
              }}
            >
              PAID{' '}
              <span style={{ backgroundColor: '#b8ffb8', padding: '4px 8px', borderRadius: '5px' }}> {trueCount} </span>
            </span>
          }
          value='TRUE'
        />
        <Tab
          label={
            <span
              style={{
                color: tab === 'FALSE' ? 'black' : undefined,
                fontWeight: tab === 'FALSE' ? 'bold' : undefined
              }}
            >
              NOT PAID{' '}
              <span style={{ backgroundColor: '#ffb8b8', padding: '4px 8px', borderRadius: '5px' }}>
                {' '}
                {falseCount}{' '}
              </span>
            </span>
          }
          value='FALSE'
        />
        <Tab
          label={
            <span
              style={{
                color: tab === 'SUCCESS' ? 'black' : undefined,
                fontWeight: tab === 'SUCCESS' ? 'bold' : undefined
              }}
            >
              SUCCESS{' '}
              <span style={{ backgroundColor: '#b8b8ff', padding: '4px 8px', borderRadius: '5px' }}>
                {' '}
                {successCount}{' '}
              </span>
            </span>
          }
          value='SUCCESS'
        />
      </Tabs>

      <Button variant='contained' component='label'>
        Import CSV
        <input type='file' hidden onChange={handleFileUpload} />
      </Button>

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
              <MenuItem
                value='-1'
                onClick={() => {
                  setSelectedRound(null)
                }}
              >
                รอบจองหอพักทั้งหมด
              </MenuItem>
              {roundNames.map(round => (
                <MenuItem
                  value={round.round_id}
                  onClick={() => {
                    setSelectedRound(round.round_id)
                  }}
                >
                  {round.round_name}
                </MenuItem>
              ))}
            </Select>
            <Button variant='contained' component='label' onClick={() => exportToCSV(selectedRound)}>
              Export CSV
            </Button>
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
                    a
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox color='primary' checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                    </TableCell>
                    <TableCell component='th' id={labelId} scope='row' padding='none'>
                      {row.Users?.student_id}
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
                    <TableCell align='left'>
                      {tab === 'TRUE' ? (
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
                      ) : tab === 'FALSE' ? (
                        <Button
                          variant='outlined'
                          color='error'
                          size='small'
                          sx={{ minWidth: '30px', marginRight: '10px' }}
                          onClick={event => {
                            event.stopPropagation()
                            handleReject(row.id)
                          }}
                        >
                          <CloseIcon color='error' />
                        </Button>
                      ) : null}
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

export default ResidentApprove
