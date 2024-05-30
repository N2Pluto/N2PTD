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
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { alpha, useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
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
import { Parser } from 'json2csv' // Import json2csv
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { makeStyles } from '@mui/styles'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const useStyles = makeStyles({
  success: {
    backgroundColor: '#4caf50'
  },
  reject: {
    backgroundColor: '#f44336'
  },
  backdrop: {
    color: '#fff'
  }
})

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

type EnhancedTableToolbarProps = {
  numSelected: number
  selected: SelectedUserType[]
  resetSelected: () => void
  handleApprove: (ids: number[]) => Promise<void>
  handleReject: (ids: number[]) => Promise<void>
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, selected, resetSelected, handleApprove, handleReject } = props
  console.log(selected)

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
        <Typography sx={{ flex: '1 1 100%', pl: 5 }} variant='h6' id='tableTitle' component='div'>
          Reservation Control
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <IconButton onClick={() => handleApprove(selected.map(item => item.id))}>
            <CheckIcon />
          </IconButton>
          <IconButton onClick={() => handleReject(selected.map(item => item.id))}>
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <Tooltip title='Filter list'>
          {/* <IconButton>
            <FilterListIcon />
          </IconButton> */}
        </Tooltip>
      )}
    </Toolbar>
  )
}

const ReservationApprove = () => {
  const classes = useStyles()
  const [users, setUsers] = React.useState<User[]>([])
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof User>('id')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [tab, setTab] = React.useState('pending')
  const [searchValue, setSearchValue] = React.useState('')
  const [roundNames, setRoundNames] = React.useState<{ round_name: string; round_id: number }[]>([])
  const [dormNames, setDormNames] = React.useState<{ dorm_name: string; dorm_id: number }[]>([])
  const [selectRoundValue, setSelectRoundValue] = React.useState('-1')
  const [selectDormValue, setSelectDormValue] = React.useState('-1')
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>([])
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [openApprove, setOpenApprove] = React.useState(false)
  const [openReject, setOpenReject] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenApprove(false)
    setOpenReject(false)
  }

  const handleSelectRoundChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedRoundId = event.target.value as number
    console.log('selectedRoundId', selectedRoundId)
    setSelectRoundValue(event.target.value as string)
  }

  const handleSelectDormChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedDormId = event.target.value as number
    console.log('selectedDormId', selectedDormId)
    setSelectDormValue(event.target.value as string)
  }

  useEffect(() => {
    let filtered = users

    if (selectRoundValue !== '-1') {
      filtered = filtered.filter(user => user.round_id === Number(selectRoundValue))
    }

    if (selectDormValue !== '-1') {
      filtered = filtered.filter(user => user.dorm_id === Number(selectDormValue))
    }

    setFilteredUsers(filtered)
  }, [users, selectRoundValue, selectDormValue])

  useEffect(() => {
    fetchData()
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

        const uniqueDormIds = Array.from(new Set(data.map((user: User) => user.dorm_id)))
        const uniqueDormNames = uniqueDormIds.map(id => {
          const user = data.find((user: User) => user.dorm_id === id)

          return { dorm_name: user.Dormitory_Building.name, dorm_id: user.dorm_id }
        })
        setDormNames(uniqueDormNames)
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

  const resetSelected = () => {
    setSelected([])
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentTabUsers = filteredUsers.filter(user => user.status.toLowerCase() === tab)
    const currentTabUserIds = currentTabUsers.map(n => n.id)

    if (currentTabUserIds.every(id => selected.includes(id))) {
      // If all users in the current tab are already selected, deselect them
      setSelected(prevSelected => prevSelected.filter(id => !currentTabUserIds.includes(id)))
    } else {
      // Otherwise, select all users in the current tab
      setSelected(prevSelected => Array.from(new Set([...prevSelected, ...currentTabUserIds])))
    }
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

  const handleExportCSV = () => {
    const fields = [
      { label: 'student_id', value: 'Users.student_id' },
      { label: 'name', value: 'Users_Info.name' },
      { label: 'lastname', value: 'Users_Info.lastname' },
      { label: 'dorm_name', value: 'Dormitory_Building.name' },
      { label: 'room_number', value: 'Dormitory_Room.room_number' },
      { label: 'bed_number', value: 'Dormitory_Bed.bed_number' },
      { label: 'room_name', value: 'Reservation_System.round_name' }
    ]
    const parser = new Parser({ fields })
    const csv = parser.parse(filteredUsers)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'WU_User_Reservation.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Use filteredUsers instead of users
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0

  const filteredUsersByTab = filteredUsers.filter(user => {
    switch (tab) {
      case 'pending':
        return user.status === 'Pending'
      case 'approve':
        return user.status === 'Approve'
      case 'reject':
        return user.status === 'Reject'
      default:
        return true
    }
  })

  const visibleRows = React.useMemo(() => {
    const lowerCaseSearchValue = searchValue.toLowerCase()

    const filteredUsersBySearch = filteredUsersByTab.filter(user => {
      if (!isNaN(Number(searchValue))) {
        return user.Users?.student_id.includes(lowerCaseSearchValue)
      } else {
        return `${user.Users_Info?.name} ${user.Users_Info?.lastname}`.toLowerCase().includes(lowerCaseSearchValue)
      }
    })

    return stableSort(filteredUsersBySearch, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
  }, [order, orderBy, page, rowsPerPage, filteredUsersByTab, searchValue])

  const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }

    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleApprove = async (ids: number[]) => {
    setLoading(true)
    await Promise.all(
      ids.map(async id => {
        const response = await fetch('/api/admin/reservationApprove/update/updateApprove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, status: 'Approve' })
        })

        if (!response.ok) {
          console.error(`Failed to update reservation status for id ${id}`)
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
                subject: 'Reservation Approved',
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
                  <h1>Your Reservation is Approved</h1>
                  <p>Dear ${user.Users_Info.name} ${user.Users_Info.lastname},</p>
                  <p>We are delighted to inform you that your reservation has been approved. We look forward to welcoming you to our establishment.</p>
                  <p>Please find the details of your reservation below:</p>
                  <ul>
                    <li>Building: ${user.Dormitory_Building.name}</li>
                    <li>Room: ${user.Dormitory_Room.room_number}</li>
                    <li>Bed: ${user.Dormitory_Bed.bed_number}</li>
                  </ul>
                  <p>If you have any further questions or concerns, please do not hesitate to contact us.</p>
                  <p>Best regards,<br>WU Dormitory</p>
                </div>
              </body>
            </html>
            `
              })
            })
          }
        }
      })
    )
    setOpenApprove(true)
    resetSelected()
    setLoading(false)
  }

  const handleReject = async (ids: number[]) => {
    setLoading(true)
    await Promise.all(
      ids.map(async id => {
        const response = await fetch('/api/admin/reservationApprove/update/updateApprove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, status: 'Reject' })
        })

        if (!response.ok) {
          console.error(`Failed to update reservation status for id ${id}`)
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
                subject: 'Reservation Rejected',
                html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body {
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    background-color: #f7f7f7;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                    color: #333333;
                    text-align: center;
                    margin-top: 0;
                    font-weight: 600;
                  }
                  p {
                    line-height: 1.6;
                    color: #555555;
                  }
                  ul {
                    list-style-type: none;
                    padding: 0;
                    margin: 20px 0;
                  }
                  li {
                    margin-bottom: 10px;
                    color: #777777;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Your Reservation is Rejected</h1>
                  <p>Dear ${user.Users_Info.name} ${user.Users_Info.lastname},</p>
                  <p>We regret to inform you that your reservation has been rejected due to the following reasons:</p>
                  <ul>
                    <li>Reason 1</li>
                    <li>Reason 2</li>
                    <li>Reason 3</li>
                  </ul>
                  <p>We apologize for any inconvenience this may have caused you. If you have any further questions or concerns, please do not hesitate to contact our support team.</p>
                  <p>Best regards,<br>WU Dormitory</p>
                </div>
              </body>
            </html>
            `
              })
            })
          }
        }
      })
    )
    setOpenReject(true)
    resetSelected()
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning'
      case 'Reject':
        return 'error'
      case 'Approve':
        return 'success'
      default:
        return 'default'
    }
  }

  const pendingCount = filteredUsers.filter(user => user.status === 'Pending').length
  const approveCount = filteredUsers.filter(user => user.status === 'Approve').length

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label='reservation status tabs'>
          <Tab
            label={
              <span
                style={{
                  color: tab === 'pending' ? 'black' : undefined,
                  fontWeight: tab === 'pending' ? 'bold' : undefined
                }}
              >
                REQ LIST{' '}
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
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: 5 }}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel id='form-layouts-separator-select-label'>Round</InputLabel>
              <Select
                label='Round'
                value={selectRoundValue}
                onChange={handleSelectRoundChange}
                id='form-layouts-separator-select'
                labelId='form-layouts-separator-select-label'
              >
                <MenuItem value='-1'>All Rounds</MenuItem>
                {roundNames.map(round => (
                  <MenuItem key={round.round_id} value={round.round_id}>
                    {round.round_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth sx={{ flexGrow: 1, ml: 4 }}>
              <InputLabel id='form-layouts-separator-select-label'>Dormitory</InputLabel>
              <Select
                label='Dormitory'
                value={selectDormValue}
                onChange={handleSelectDormChange}
                id='form-layouts-separator-select'
                labelId='form-layouts-separator-select-label'
              >
                <MenuItem value='-1'>All Dormitories</MenuItem>
                {dormNames.map(dorm => (
                  <MenuItem key={dorm.dorm_id} value={dorm.dorm_id}>
                    {dorm.dorm_name}
                  </MenuItem>
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
          <Grid item xs={12} sm={0.5}>
            <IconButton onClick={handleMenuOpen} sx={{ flexGrow: 1, ml: 8, mt: 2 }}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
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
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected.map(id => filteredUsers.find(user => user.id === id) || ({} as SelectedUserType))}
            resetSelected={resetSelected}
            handleApprove={async ids => {
              await handleApprove(ids)
              resetSelected()
              setOpenApprove(true)
            }}
            handleReject={async ids => {
              await handleReject(ids)
              resetSelected()
              setOpenReject(true)
            }}
          />
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
                        <Checkbox
                          color='primary'
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
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
                      <TableCell>{formatDate(row.created_at)}</TableCell>
                      <TableCell align='left'>
                        {tab === 'pending' && (
                          <>
                            <IconButton
                              onClick={async event => {
                                event.stopPropagation()
                                setSelected([row.id])
                                await handleApprove([row.id])
                                resetSelected()
                                setOpenApprove(true)
                              }}
                            >
                              <CheckIcon />
                            </IconButton>
                            <IconButton
                              onClick={async event => {
                                event.stopPropagation()
                                setSelected([row.id])
                                await handleReject([row.id])
                                resetSelected()
                                setOpenReject(true)
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={9} />
                  </TableRow>
                )}
                {visibleRows.length === 0 && (
                  <TableRow style={{ height: 100 }}>
                    <TableCell colSpan={11}>
                      <Paper
                        style={{
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
                          />
                          <Typography variant='body2'>Data Not Found</Typography>
                        </div>
                      </Paper>
                    </TableCell>
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
        {/* <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label='Dense' /> */}
      </Box>

      <Backdrop open={loading} style={{ color: '#fff', zIndex: 1500 }}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Snackbar
        open={openApprove}
        autoHideDuration={5000}
        onClose={handleClose}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {'Reservation Approved Successfully!'}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.success }}
      />
      <Snackbar
        open={openReject}
        autoHideDuration={5000}
        onClose={handleClose}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {' Reservation rejected successfully!'}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.reject }}
      />
    </>
  )
}

export default ReservationApprove
