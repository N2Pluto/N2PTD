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
import Papa from 'papaparse'
import { Menu } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Drawer from '@mui/material/Drawer'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Divider from '@mui/material/Divider'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { makeStyles } from '@mui/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import SearchIcon from '@mui/icons-material/Search'

// ** Styles

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: theme.palette.success.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  }
}))

interface User {
  id: number
  dorm_id: number
  room_id: number
  bed_id: number
  user_id: string
  round_id: number
  status: string
  created_at: string
  payment_status: string
}

interface EnhancedTableToolbarProps {
  numSelected: number
  selected: SelectedUserType[]
  resetSelected: () => void
  id: string // add this line
  handleApprove: (ids: number[]) => Promise<void>
  handleReject: (ids: number[]) => Promise<void>
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, selected, resetSelected, handleApprove, handleReject } = props

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
          Resident Control
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
          <IconButton>{/* <FilterListIcon /> */}</IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

const ResidentApprove = () => {
  const classes = useStyles()
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
  const [anchorEl, setAnchorEl] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [parsedData, setParsedData] = useState([])
  const [file, setFile] = React.useState(null)
  const [exportSnackbarOpen, setExportSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarClass, setSnackbarClass] = useState('')
  const [importSnackbarOpen, setImportSnackbarOpen] = useState(false)
  const [approvedSnackbarOpen, setApprovedSnackbarOpen] = useState(false)
  const [rejectedSnackbarOpen, setRejectedSnackbarOpen] = useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleCloseApprovedSnackbar = () => {
    setApprovedSnackbarOpen(false)
  }

  const handleCloseRejectedSnackbar = () => {
    setRejectedSnackbarOpen(false)
  }

  const handleCloseExportSnackbar = () => {
    setExportSnackbarOpen(false)
    console.log('handleCloseExportSnackbar')
  }

  const handleCloseImportSnackbar = () => {
    setImportSnackbarOpen(false)
  }

  const handleFileUpload = acceptedFiles => {
    const uploadedFile = acceptedFiles[0]
    setFile(uploadedFile)

    Papa.parse(uploadedFile, {
      header: true,
      complete: results => {
        setParsedData(results.data)
        console.log('Parsed data:', results.data)
      }
    })
  }

  const handleRemoveFile = () => {
    setFile(null)
    setParsedData([])
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

  const resetSelected = () => {
    setSelected([])
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentTabUsers = filteredUsers.filter(user => user.payment_status === tab)
    const currentTabUserIds = currentTabUsers.map(n => n.id)

    if (currentTabUserIds.every(id => selected.includes(id))) {
      // If all users in the current tab are already selected, deselect them
      setSelected(prevSelected => prevSelected.filter(id => !currentTabUserIds.includes(id)))
    } else {
      // Otherwise, select all users in the current tab
      setSelected(prevSelected => Array.from(new Set([...prevSelected, ...currentTabUserIds])))
    }
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

  // Use filteredUsers instead of users
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0

  const filteredUsersByTab = filteredUsers.filter(user => {
    switch (tab) {
      case 'Waiting':
        return user.payment_status === 'Pending'
      case 'TRUE':
        return user.payment_status === 'TRUE'
      case 'FALSE':
        return user.payment_status === 'FALSE'
      case 'SUCCESS':
        return user.payment_status === 'SUCCESS'
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

  const isSelected = (id: number) => selected.indexOf(id) !== -1

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
    console.log('newSelected', newSelected)
  }

  const handleApprove = async (ids: number[]) => {
    setLoading(true)
    ids.forEach(async id => {
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

      resetSelected()
      setApprovedSnackbarOpen(true)

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
      setLoading(false)
    })
  }

  const handleReject = async (ids: number[]) => {
    setLoading(true)
    ids.forEach(async id => {
      event.stopPropagation()

      // Call the API endpoint
      const response = await fetch('/api/admin/residentApprove/delete/deleteResident', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
      resetSelected()
      setRejectedSnackbarOpen(true)
      setLoading(false)

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
    })
  }

  const getStatusColor = (payment_status: string) => {
    switch (payment_status) {
      case 'Pending':
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

  const waitingCount = filteredUsers.filter(user => user.payment_status === 'Pending').length
  const trueCount = filteredUsers.filter(user => user.payment_status === 'TRUE').length
  const falseCount = filteredUsers.filter(user => user.payment_status === 'FALSE').length
  const successCount = filteredUsers.filter(user => user.payment_status === 'SUCCESS').length

  console.log('filteredUsers:', filteredUsers)

  const handleImportCSV = async (parsedData: any[]) => {
    console.log('Imported CSV data:', parsedData)
    const updatedUsers = [...users]

    updatedUsers.forEach(user => {
      // Check if the student_id exists in the imported data
      const existsInImportedData = parsedData.some(({ student_id }) => student_id === user.Users?.student_id)

      // Set the payment_status based on the existence of the student_id in the imported data
      user.payment_status = existsInImportedData ? 'TRUE' : 'FALSE'
    })

    setUsers(updatedUsers)
    console.log('updatedUsers', updatedUsers)

    const response = await fetch('/api/admin/residentApprove/update/updateResidentApprove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ updatedUsers })
    })
    handleDrawerClose()
    if (!response.ok) {
      console.error('Failed to update users:', await response.text())
    } else {
      setImportSnackbarOpen(true)
    }
  }

  const exportToCSV = (roundId: number | null) => {
    console.log('exportToCSV called')
    try {
      // First, filter users based on the selected round ID
      const filteredUsersByRound = users.filter(user => roundId === null || user.round_id === roundId)

      // Then, filter the already filtered users based on the selected tab
      const filteredUsersByTab = filteredUsersByRound.filter(user => {
        switch (tab) {
          case 'Waiting':
            return user.payment_status === 'Pending'
          case 'TRUE':
            return user.payment_status === 'TRUE'
          case 'FALSE':
            return user.payment_status === 'FALSE'
          case 'SUCCESS':
            return user.payment_status === 'SUCCESS'
          default:
            return true
        }
      })

      if (filteredUsersByTab.length > 0) {
        // Format the data for CSV export
        const csvData = filteredUsersByTab.map(user => ({
          student_id: user.Users?.student_id,
          name: user.Users_Info?.name,
          lastname: user.Users_Info?.lastname,
          building_name: user.Dormitory_Building.name,
          room_number: user.Dormitory_Room.room_number,
          bed_number: user.Dormitory_Bed.bed_number,
          round_name: user.Reservation_System.round_name
        }))
        const csv = Papa.unparse(csvData)
        const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const csvURL = window.URL.createObjectURL(csvBlob)
        let tempLink = document.createElement('a')
        tempLink.href = csvURL
        tempLink.setAttribute(
          'download',
          `data_${roundId || 'all'}_${
            tab === 'TRUE'
              ? 'Paid'
              : tab === 'FALSE'
              ? 'Not Paid'
              : tab === 'Waiting'
              ? 'Pending'
              : tab === 'SUCCESS'
              ? 'Success'
              : tab
          }.csv`
        )
        tempLink.click()

        // Success Snackbar
        setSnackbarMessage('Exporting CSV Successfully!')
        setSnackbarClass(classes.success) // Assuming `classes.success` is your success style
      } else {
        // No data Snackbar
        setSnackbarMessage('No Data to Export')
        setSnackbarClass(classes.error) // Assuming `classes.error` is your error style
      }

      // Open the Snackbar
      setExportSnackbarOpen(true)
      console.log('Snackbar is set to open')
    } catch (error) {
      // Handle the error here
      console.error('Error exporting to CSV:', error)
    }
  }

  const handleMenuOpen = event => {
    console.log('handleMenuOpen called')
    setAnchorEl(event.currentTarget)
    setMenuOpen(true)
    console.log('Menu opened')
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuOpen(false)
    console.log('Menu closed')
  }

  const handleDrawerOpen = () => {
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileUpload,
    accept: '.csv'
  })

  return (
    <>
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
                <span style={{ backgroundColor: '#b8ffb8', padding: '4px 8px', borderRadius: '5px' }}>
                  {' '}
                  {trueCount}{' '}
                </span>
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
                  All Rounds
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
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Search'
              placeholder='Leonard Carter'
              value={searchValue}
              onChange={handleSearchChange}
              sx={{ flexGrow: 1, ml: 5 }}
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

            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  handleDrawerOpen()
                }}
              >
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src='https://img5.pic.in.th/file/secure-sv1/csv-file-format-extension_28842.png'
                    width='25'
                    height='25'
                    alt='CSV Icon'
                  />
                  <div style={{ marginLeft: '10px' }}>
                    <Typography variant='subtitle1'>Import</Typography>
                    <Typography variant='body2' color='textSecondary'>
                      Import CSV data.
                    </Typography>
                  </div>
                </label>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  exportToCSV(selectedRound)
                  handleMenuClose() // Ensure the menu closes after clicking "Export"
                }}
              >
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

            <Drawer anchor='right' open={drawerOpen} onClose={handleDrawerClose}>
              <Box sx={{ width: '40vw', padding: 2, margin: 3 }}>
                <Typography variant='h5' sx={{ mb: 2, mt: 2 }}>
                  Import CSV
                </Typography>
              </Box>

              <Divider sx={{ borderWidth: 'px' }} />

              <Box
                sx={{ width: '40vw', padding: 2, margin: 3 }}
                role='presentation'
                onClick={event => event.stopPropagation()}
                onKeyDown={handleDrawerClose}
              >
                <Typography variant='body2' sx={{ mb: 2 }}>
                  Upload a CSV or TSV file. The first row should be the headers of the table, and your headers should
                  not include any special characters other than hyphens ( - ) or underscores ( _ ).
                  <br />
                  Tip: Datetime columns should be formatted as YYYY-MM-DD HH:mm:ss
                </Typography>

                {!file ? (
                  <Grid
                    sx={{
                      height: '600px'
                    }}
                  >
                    <Box
                      {...getRootProps()}
                      sx={{
                        border: '2px dashed #ccc',
                        borderRadius: 1,
                        padding: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        mb: 2,
                        height: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <input {...getInputProps()} />
                      <Typography variant='body1'>
                        Drag and drop, or <span style={{ color: '#3f51b5', cursor: 'pointer' }}>browse</span> your files
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      border: '2px dashed #ccc',
                      borderRadius: 1,
                      padding: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      mb: 2,
                      height: '150px',
                      display: 'flex',
                      flexDirection: 'column', // Add this line
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant='body1'>{file.name}</Typography>
                    <Button variant='contained' color='secondary' onClick={handleRemoveFile} sx={{ mt: 2 }}>
                      Remove File
                    </Button>
                  </Box>
                )}

                {parsedData.filter(row => row.student_id !== '').length > 0 && (
                  <Box sx={{ mt: 4, height: 'px', overflow: 'auto' }}>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                      Preview data to be imported
                    </Typography>
                    <Box
                      sx={{
                        height: '400px',
                        overflow: 'auto',
                        border: '1px solid #ccc', // Increased border thickness
                        padding: 2,
                        borderRadius: 1,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Added shadow
                        backgroundColor: '#fff' // White background for the table
                      }}
                    >
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            {Object.keys(parsedData[0]).map(key => (
                              <th
                                key={key}
                                style={{
                                  padding: '12px 8px',
                                  borderBottom: '1px solid #ccc', // Increased border thickness
                                  borderRight: '1px solid #ccc', // Increased border thickness
                                  backgroundColor: '#f5f5f5',
                                  fontWeight: 'bold',
                                  textAlign: 'left'
                                }}
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData
                            .filter(row => row.student_id !== '')
                            .map((row, index) => (
                              <tr
                                key={index}
                                style={{
                                  transition: 'background-color 0.3s ease',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                              >
                                {Object.values(row).map((value, idx) => (
                                  <td
                                    key={idx}
                                    style={{
                                      padding: '8px 8px',
                                      borderBottom: '1px solid #eee', // Increased border thickness
                                      borderRight: '1px solid #eee', // Increased border thickness
                                      textAlign: 'left'
                                    }}
                                  >
                                    {value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </Box>
                  </Box>
                )}
              </Box>

              <Divider sx={{ borderWidth: '1px' }} />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mr: 2 }}>
                <Button variant='contained' color='primary' onClick={handleDrawerClose} sx={{ mr: 2 }}>
                  Cancel
                </Button>
                <Button variant='contained' color='primary' onClick={() => handleImportCSV(parsedData)} sx={{ mr: 2 }}>
                  Import data
                </Button>
              </Box>
            </Drawer>
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
              setApprovedSnackbarOpen(true)
            }}
            handleReject={async ids => {
              await handleReject(ids)
              resetSelected()
              setRejectedSnackbarOpen(true)
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
                tab={tab}
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
                        <Chip
                          label={row.payment_status ? row.payment_status : 'Pending'}
                          color={getStatusColor(row.payment_status)}
                        />
                      </TableCell>
                      <TableCell align='left'>
                        {tab === 'TRUE' ? (
                          <>
                            <IconButton
                              onClick={async event => {
                                event.stopPropagation()
                                setSelected([row.id])
                                await handleApprove([row.id])
                                resetSelected()
                                setApprovedSnackbarOpen(true)
                              }}
                            >
                              <CheckIcon />
                            </IconButton>
                          </>
                        ) : null}

                        {tab === 'FALSE' ? (
                          <IconButton
                            onClick={async event => {
                              event.stopPropagation()
                              setSelected([row.id])
                              await handleReject([row.id])
                              resetSelected()
                              setRejectedSnackbarOpen(true)
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
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
                {visibleRows.length === 0 && (
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
        open={exportSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseExportSnackbar}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {snackbarMessage}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleCloseExportSnackbar}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: snackbarClass }}
      />
      <Snackbar
        open={importSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseImportSnackbar}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {'Importing CSV Successfully!'}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleCloseImportSnackbar}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.success }}
      />
      <Snackbar
        open={approvedSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseApprovedSnackbar}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {'Approved Resident Successfully!'}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleCloseApprovedSnackbar}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.success }}
      />
      <Snackbar
        open={rejectedSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseRejectedSnackbar}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {'Rejected User Successfully!'}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleCloseRejectedSnackbar}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.error }}
      />
    </>
  )
}

export default ResidentApprove
