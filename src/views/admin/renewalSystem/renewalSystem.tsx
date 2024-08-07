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
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import { Parser } from 'json2csv'
import Snackbar from '@mui/material/Snackbar'
import CloseIcon from '@mui/icons-material/Close'
import { makeStyles } from '@mui/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import IconButton from '@mui/material/IconButton'
import { FaEdit } from 'react-icons/fa'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Menu from '@mui/material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Typography from '@mui/material/Typography'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import sendLogsadminApprove from 'src/pages/api/log/admin/approve/insert'
import { userStore } from 'src/stores/userStore'

const useStyles = makeStyles({
  success: {
    backgroundColor: 'green'
  }
})

interface User {
  id: number
  dorm_id: number
  room_id: number
  bed_id: number
  user_id: string
  round_id: number
  created_at: string
  renew_status: string
  Users: {
    student_id: string
    email: string
  }
  Dormitory_Building: {
    name: string
  }
  Dormitory_Room: {
    room_number: number
  }
  Dormitory_Bed: {
    bed_number: number
  }
  Reservation_System: {
    round_name: string
  }
  Users_Info: {
    name: string
    lastname: string
  }
}

const RenewalSystem = () => {
  const classes = useStyles()
  const [users, setUsers] = useState<User[]>([])
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<keyof User>('user_id')
  const [selected, setSelected] = useState<readonly number[]>([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [tab, setTab] = useState('Pending')
  const [selectRoundValue, setSelectRoundValue] = useState('-1')
  const [open, setOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('success')
  const [logMessages, setLogMessages] = useState<string[]>([])
  const [selectedCount, setSelectedCount] = useState(0)
  const [backdropOpen, setBackdropOpen] = useState(false)
  const { user } = userStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const logAdminApprove = async (
    ids: number[],
    studentIds: string,
    domename: string,
    romenum: string,
    bednum: string,
    round: string
  ) => {
    try {
      const content = `Approve "Renewal" for student ID: '${studentIds}' in '${domename}' Room: '${romenum}' Bed: '${bednum}' Round: '${round}'`
      await sendLogsadminApprove(user?.student_id, content, 'Renewal')
    } catch (error) {
      console.error('Error logging admin approval:', error)
    }
  }

  const handleApprove = async (row: User) => {
    setBackdropOpen(true)
    try {
      const response = await fetch(`/api/admin/renewalSystem/create/createReservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: row.user_id,
          id: row.id // pass the id for status update
        })
      })

      if (response.ok) {
        await fetch('/api/admin/renewalSystem/nodemailer/nodemailer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: row.Users.email,
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
        ul {
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
        <p>Dear ${row.Users_Info.name} ${row.Users_Info.lastname},</p>
        <p>We are thrilled to inform you that your reservation to stay in our dormitory for the upcoming academic term has been successfully approved. This means that you can continue to enjoy the comfort and convenience of staying in the same dormitory where you have made so many memories.</p>
        <p>We understand how important it is to have a stable and supportive living environment, especially during your academic journey. Our team is committed to ensuring that your experience in our dormitory is as pleasant and productive as possible. Our facilities are designed to provide you with everything you need to focus on your studies and personal growth.</p>
        <p>Below are the details of your approved reservation:</p>
        <ul>
          <li><strong>Building:</strong> ${row.dorm_id}</li>
          <li><strong>Room:</strong> ${row.room_id}</li>
          <li><strong>Bed:</strong> ${row.bed_id}</li>
        </ul>
        <p>We hope that you will continue to take advantage of the amenities and community spirit that our dormitory offers. Should you have any questions or require further assistance, please do not hesitate to reach out to our support team. We are here to help you and ensure that your stay with us is as comfortable as possible.</p>
        <p>Best regards,<br>WU Dormitory</p>
      </div>
    </body>
  </html>
  `
          })
        })

        // Extract values for logging
        const domename = row.Dormitory_Building.name
        const romenum = row.Dormitory_Room.room_number
        const bednum = row.Dormitory_Bed.bed_number
        const round = row.Reservation_System.round_name
        const studentId = row.Users?.student_id

        // Log admin approval
        await logAdminApprove([row.id], studentId, domename, romenum, bednum, round)

        setSnackbarMessage(
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Reservation approved successfully
          </span>
        )
        setSnackbarColor('success')
        setOpen(true)
        setSelected([]) // Reset selected state
        setSelectedCount(0) // Reset selected count
        setBackdropOpen(false)
      } else {
        console.error('Failed to approve reservation')
      }
    } catch (error) {
      console.error('Error approving reservation:', error)
    }
  }

  const logAdminReject = async (
    studentIds: string,
    domename: string,
    romenum: string,
    bednum: string,
    round: string
  ) => {
    const content = `Reject "Renewal" for student ID: '${studentIds}' in '${domename}' Room: '${romenum}' Bed: '${bednum}' Round: '${round}'`
    await sendLogsadminApprove(user?.student_id, content, 'Renewal')
  }

  const handleDelete = async (id: number) => {
    setBackdropOpen(true)
    try {
      const response = await fetch(`/api/admin/renewalSystem/delete/deleteReservation`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        // Find the user that matches the id
        const user = users.find(user => user.id === id)

        if (user) {
          // Send an email to the user
          const emailResponse = await fetch(`/api/admin/renewalSystem/nodemailer/nodemailer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              to: user.Users.email,
              subject: 'Reservation Cancelled',
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
        <h1>Your Reservation has been Cancelled</h1>
        <p>Dear ${user.Users_Info.name} ${user.Users_Info.lastname},</p>
        <p>We regret to inform you that your reservation for the upcoming academic term has been cancelled. This decision was made because you have chosen not to stay in the dormitory for the next term.</p>
        <p>We understand that there can be many reasons for this decision, and we respect your choice. Please note that your departure from the dormitory has been processed accordingly.</p>
        <p>If you have any questions or need further assistance, do not hesitate to contact our support team. We are here to help and ensure that your transition is as smooth as possible.</p>
        <p>Thank you for staying with us, and we wish you all the best in your future endeavors.</p>
        <p>Best regards,<br>WU Dormitory</p>
      </div>
    </body>
  </html>
  `
            })
          })
          const domename = user.Dormitory_Building.name
          const romenum = user.Dormitory_Room.room_number
          const bednum = user.Dormitory_Bed.bed_number
          const round = user.Reservation_System.round_name
          const studentId = user.Users.student_id

          // Call logAdminReject with the extracted values
          await logAdminReject(studentId, domename, romenum, bednum, round)

          if (!emailResponse.ok) {
            console.error('Failed to send email')
          }
        }

        setUsers(prevUsers => prevUsers.filter(user => user.id !== id))
        setSnackbarMessage(
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Reservation deleted successfully
          </span>
        )
        setSnackbarColor('error')
        setOpen(true)
        setSelected([]) // Reset selected state
        setSelectedCount(0) // Reset selected count
        setBackdropOpen(false)
      } else {
        console.error('Failed to delete reservation')
      }
    } catch (error) {
      console.error('Error deleting reservation:', error)
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const handleClickCSV = () => {
    const filteredUsersForExport = users.filter(user => {
      const matchesTab = tab === 'all' || user.renew_status === tab
      const matchesRound = selectRoundValue === '-1' || user.round_id === Number(selectRoundValue)

      return matchesTab && matchesRound
    })

    const dataToExport = filteredUsersForExport.map(user => ({
      student_id: user.Users?.student_id,
      name: user.Users_Info?.name,
      lastname: user.Users_Info?.lastname,
      dormitory_building: user.Dormitory_Building.name,
      room_number: user.Dormitory_Room.room_number,
      bed_number: user.Dormitory_Bed.bed_number,
      round_name: user.Reservation_System.round_name
    }))

    if (dataToExport.length === 0) {
      setSnackbarMessage(
        <span>
          <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          No data available for export
        </span>
      )
      setOpen(true)
      setSnackbarColor('error') // Assuming there's a state to control Snackbar color
      return
    }

    const parser = new Parser()
    const csv = parser.parse(dataToExport)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `WU_Renewal_Resident_${tab}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setSnackbarMessage(
      <span>
        <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
        CSV Exported Successfully
      </span>
    )
    setOpen(true)
    setSnackbarColor('success') // Assuming there's a state to control Snackbar color
    setSelected([]) // Reset selected state
    setSelectedCount(0) // Reset selected count
    handleMenuClose()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch(`/api/admin/renewalSystem/read/fetchRenewal`).then(res => res.json())
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data
        const response = await fetch('/api/admin/renewalDormitory/read/')
        const result = await response.json()
        setRows(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()

    const intervalId = setInterval(fetchData, 3000)

    return () => clearInterval(intervalId)
  }, [])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tabFilteredUsers = users.filter(user => {
      const matchesTab = tab === 'all' || user.renew_status === tab
      const matchesRound = selectRoundValue === '-1' || user.round_id === Number(selectRoundValue)
      return matchesTab && matchesRound
    })

    if (event.target.checked) {
      const newSelected = tabFilteredUsers.map(n => n.id)
      setSelected(newSelected)
      setSelectedCount(newSelected.length)
      console.log(`Selected ${newSelected.length} IDs in tab: ${tab}`)
      return
    }
    setSelected([])
    setSelectedCount(0)
    console.log(`Selected 0 IDs in tab: ${tab}`)
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
    setSelectedCount(newSelected.length)
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setTab(newValue)
  }

  const handleSelectRoundChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectRoundValue(event.target.value as string)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      searchTerm === '' ||
      (isNaN(Number(searchTerm))
        ? `${user.Users_Info?.name} ${user.Users_Info?.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
        : user.Users?.student_id.includes(searchTerm))
    const matchesTab = tab === 'all' || user.renew_status === tab
    const matchesRound = selectRoundValue === '-1' || user.round_id === Number(selectRoundValue)

    return matchesSearch && matchesTab && matchesRound
  })

  const isSelected = (id: number) => selected.indexOf(id) !== -1

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0
  const uniqueRounds = [...new Set(users.map(user => user.round_id))]
  const countStatus = (status: string) => users.filter(user => user.renew_status === status).length

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange} aria-label='status tabs'>
          <Tab label={`Pending (${countStatus('Pending')})`} value='Pending' />
          <Tab label={`Stay (${countStatus('stay')})`} value='stay' />
          <Tab label={`Leave (${countStatus('leave')})`} value='leave' />
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
                {uniqueRounds.map((round_id, index) => (
                  <MenuItem key={index} value={round_id}>
                    {users.find(user => user.round_id === round_id).Reservation_System.round_name} ({round_id})
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
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ flexGrow: 1, ml: 8 }}
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
            <IconButton onClick={handleMenuOpen} sx={{ flexGrow: 1, ml: 8, mt: 2 }}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleClickCSV}>
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 2,
            width: '100%',
            height: 'auto',
            backgroundColor: selected.length > 0 ? '#fbf4f4' : 'transparent'
          }}
        >
          {selected.length > 0 && (
            <>
              <div
                style={{
                  padding: '8px',
                  borderRadius: '4px'
                }}
              >
                {selected.length} selected
              </div>
              {(tab === 'stay' || tab === 'leave') && (
                <IconButton
                  onClick={async () => {
                    setBackdropOpen(true)
                    if (tab === 'stay') {
                      for (const id of selected) {
                        const row = filteredUsers.find(user => user.id === id)
                        if (row) await handleApprove(row)
                      }
                    } else if (tab === 'leave') {
                      for (const id of selected) {
                        await handleDelete(id)
                      }
                    }
                    setSelected([]) // reset selected state
                    setBackdropOpen(false)
                  }}
                >
                  {tab !== 'Pending' && (tab === 'stay' ? <CheckIcon /> : <CloseIcon />)}
                </IconButton>
              )}
            </>
          )}
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredUsers.length}
              tab={tab}
            />
            <TableBody>
              {stableSort(filteredUsers, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id)
                  const labelId = `enhanced-table-checkbox-${index}`
                  const displayIndex = page * rowsPerPage + index + 1

                  return (
                    <TableRow
                      hover={tab !== 'Pending'}
                      onClick={tab !== 'Pending' ? event => handleClick(event, row.id) : undefined}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: tab !== 'Pending' ? 'pointer' : 'default' }}
                    >
                      <TableCell padding='checkbox' align='center'>
                        {tab === 'Pending' ? (
                          <span>#{displayIndex}</span>
                        ) : (
                          <Checkbox
                            color='primary'
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        )}
                      </TableCell>
                      <TableCell align='left'>{row.Users?.student_id}</TableCell>
                      <TableCell align='left'>
                        {row.Users_Info?.name} {row.Users_Info?.lastname}
                      </TableCell>
                      <TableCell align='left'>{row.Dormitory_Building.name}</TableCell>
                      <TableCell align='left'>{row.Dormitory_Room.room_number}</TableCell>
                      <TableCell align='left'>{row.Dormitory_Bed.bed_number}</TableCell>
                      <TableCell align='left'>
                        {row.Reservation_System.round_name} ({row.round_id})
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.renew_status}
                          color={
                            row.renew_status === 'stay' ? 'success' : row.renew_status === 'leave' ? 'error' : 'primary'
                          }
                        />
                      </TableCell>
                      {tab !== 'Pending' && tab !== 'success' && (
                        <TableCell>
                          <IconButton
                            color={
                              row.renew_status === 'stay'
                                ? 'success'
                                : row.renew_status === 'leave'
                                ? 'error'
                                : 'primary'
                            }
                            onClick={() => (row.renew_status === 'stay' ? handleApprove(row) : handleDelete(row.id))}
                          >
                            {row.renew_status === 'stay' ? <CheckIcon /> : <CloseIcon />}
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              {stableSort(filteredUsers, getComparator(order, orderBy)).length === 0 && (
                <TableRow style={{ height: 100 }}>
                  <TableCell colSpan={11}>
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
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={tab === 'all' ? 8 : 9} />
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
      {/* <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label='Dense padding' /> */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <>
            <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </>
        }
        ContentProps={{
          style: {
            backgroundColor: snackbarColor === 'success' ? '#4caf50' : '#f44336' // Green for success, red for error
          }
        }}
      />
      <Backdrop open={backdropOpen} style={{ zIndex: 1301, color: '#fff' }}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Box>
  )
}

export default RenewalSystem
