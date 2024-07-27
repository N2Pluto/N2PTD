import { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'
import { SiGoogleforms } from 'react-icons/si'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import GoogleFormEdit from './googleFormEdit'
import Chip from '@mui/material/Chip'
import EditIcon from '@mui/icons-material/Edit'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'

// ** Icons Imports
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'

interface GoogleFormData {
  id: number
  form_name: string
  form_url: string
  start_date: string
  end_date: string
  status: boolean
}

const GoogleFormTable = () => {
  const [rows, setRows] = useState<GoogleFormData[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const open = Boolean(anchorEl)
  const [formEditKey, setFormEditKey] = useState(0)
  const [currentId, setCurrentId] = useState<number | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setCurrentId(id)
    setAnchorEl(event.currentTarget)
    console.log('currentId', currentId)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = (id: number) => {
    setSelectedFormId(currentId)
    setDrawerOpen(true)
    handleClose()
    setFormEditKey(prevKey => prevKey + 1)
  }

  const handleSwitchChange = async (id: number, newStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/googleForm/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) {
        setRows(prevRows => prevRows.map(row => (row.id === id ? { ...row, status: newStatus } : row)))
      } else {
        console.error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/googleForm/read/')
        const result = await response.json()
        setRows(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Form Name</TableCell>
              <TableCell align='center'>Status</TableCell>
              <TableCell align='center'>Toggle Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row' align='center'>
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: 3,
                      position: 'relative'
                    }}
                  >
                    <Typography variant='body2' sx={{ marginBottom: 2 }}>
                      {row.form_name}
                    </Typography>
                  </CardContent>
                </TableCell>
                <TableCell align='center'>
                  <Chip label={row.status ? 'Active' : 'Inactive'} color={row.status ? 'success' : 'error'} />
                </TableCell>
                <TableCell align='center'>
                  <Switch
                    checked={row.status}
                    onChange={event => handleSwitchChange(row.id, event.target.checked)}
                    color='primary'
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default GoogleFormTable
