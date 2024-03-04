// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled, alpha } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import TableCell, { TableCellProps, tableCellClasses } from '@mui/material/TableCell'
import { Button, Divider, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import Menu, { MenuProps } from '@mui/material/Menu'
import FileCopyIcon from '@mui/icons-material/FileCopy'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
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

  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

const UserControl = () => {
  const [user, setUser] = useState([])
  const [role, setRole] = useState({role : ''})
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (role: string) => {
    setRole({ role: role });
    handleUserInfo();
    setAnchorEl(null);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/userControl/fetch_user').then(res => res.json())
        setUser(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }
    fetchData()
  }, [])

  const handleUserInfo = async () => {
    try {
      const response = await fetch('/api/userControl/updateRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role : role
        })
      })

      const { data, error } = await response.json()

      if (error) {
        console.error('Error Update data into USers table:', error.message)
      } else {
        console.log('Data Update Success:', data)
        alert('Data Update Success')
      }
    } catch (error) {
      console.error('Error Update data into USers table:', error.message)
    }
  }

  const createData = (email: string, STUDENT: string, name: string, lastname: string, phone: string, role: string) => {
    return { email, STUDENT, name, lastname, phone, role }
  }

  const rows = user.map(u => createData(u.email, u.student_id, u.name, u.lastname, u.phone, u.role))

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pl: 3 }}>
        {' '}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>email</StyledTableCell>
                <StyledTableCell align='right'>Student ID</StyledTableCell>
                <StyledTableCell align='right'>name</StyledTableCell>
                <StyledTableCell>Last name</StyledTableCell>
                <StyledTableCell align='right'>phone</StyledTableCell>
                <StyledTableCell align='right'>Role</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <StyledTableRow key={row.email}>
                  <StyledTableCell component='th' scope='row'>
                    {row.email}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{row.STUDENT}</StyledTableCell>
                  <StyledTableCell align='right'>{row.name}</StyledTableCell>
                  <StyledTableCell>{row.lastname}</StyledTableCell>
                  <StyledTableCell align='right'>{row.phone}</StyledTableCell>
                  <StyledTableCell align='right'>

                    <Button
                      id='demo-customized-button'
                      aria-controls={open ? 'demo-customized-menu' : undefined}
                      aria-haspopup='true'
                      aria-expanded={open ? 'true' : undefined}
                      variant='contained'
                      disableElevation
                      onClick={handleClick}
                      endIcon={<KeyboardArrowDownIcon />}
                    >
                      {row.role}
                    </Button>
                    <StyledMenu
                      id='demo-customized-menu'
                      MenuListProps={{
                        'aria-labelledby': 'demo-customized-button'
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={() => handleClose('')}
                    >

                        <MenuItem onClick={() => handleClose('admin')} disableRipple>
                          <EditIcon />
                          ADMIN
                        </MenuItem>


                        <MenuItem onClick={() => handleClose('user')} disableRipple>
                          <FileCopyIcon />
                          USER
                        </MenuItem>


                      <Divider sx={{ my: 0.5 }} />
                    </StyledMenu>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default UserControl

