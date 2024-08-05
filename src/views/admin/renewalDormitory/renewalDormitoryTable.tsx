import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import TableCell, { TableCellProps, tableCellClasses } from '@mui/material/TableCell'
import TuneIcon from '@mui/icons-material/Tune'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import RenewalFormEdit from './renewalDormitoryTableEdit.'
import { makeStyles } from '@mui/styles'
import TableContainer from '@mui/material/TableContainer'

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: theme.palette.success.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  }
}))

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

interface RenewalData {
  id: number
  renewal_name: string
  start_date: string
  end_date: string
  status: boolean
}

const RenewalTable = () => {
  const classes = useStyles()
  const [rows, setRows] = useState<RenewalData[]>([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarClass, setSnackbarClass] = useState('')

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/renewalDormitory/read/')
      const result = await response.json()
      setRows(result.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
    const intervalId = setInterval(fetchData, 3000)
    
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (snackbarOpen) {
      fetchData()
    }
  }, [snackbarOpen])

  const showSnackbar = (message, className) => {
    console.log('showSnackbar:', message, className)
    setSnackbarMessage(message)
    if (message.includes('Delete successful')) {
      setSnackbarClass(classes.error) // Use error class for delete operation initially
    } else {
      setSnackbarClass(className) // Use the provided className for other messages
    }
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const formatDate = (dateString: string) => {
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' }

    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell>Renewal Name</StyledTableCell>
              <StyledTableCell align='right'>Start Date</StyledTableCell>
              <StyledTableCell align='right'>End Date</StyledTableCell>
              <StyledTableCell align='right'>Round Status</StyledTableCell>
              <StyledTableCell align='center'>Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
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
                      <Typography variant='body2'>Renewal Period Not Found</Typography>
                    </div>
                  </Paper>
                </TableCell>
              </TableRow>
            ) : (
              rows.map(row => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component='th' scope='row'>
                    Semester {row.renewal_phase}, {row.renewal_name}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{formatDate(row.start_date)}</StyledTableCell>
                  <StyledTableCell align='right'>{formatDate(row.end_date)}</StyledTableCell>
                  <StyledTableCell align='right'>
                    {row.status ? (
                      <Chip label='Active' color='success' />
                    ) : (
                      <Chip label='Inactive' sx={{ backgroundColor: 'red', color: 'white' }} />
                    )}
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    <RenewalFormEdit id={row.id} showSnackbar={showSnackbar}>
                      <Button>
                        <TuneIcon />
                      </Button>
                    </RenewalFormEdit>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={
          <span>
            {snackbarMessage.includes('Update successful') && (
              <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            )}
            {snackbarClass === classes.success && !snackbarMessage.includes('Update successful') && (
              <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            )}
            {snackbarClass === classes.error && (
              <ErrorIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            )}
            {snackbarMessage}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        ContentProps={{ className: snackbarClass }}
      />
    </>
  )
}

export default RenewalTable
