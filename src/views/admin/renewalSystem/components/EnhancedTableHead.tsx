// EnhancedTableHead.tsx
import * as React from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'

interface User {
  id: number
  student_id: string
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

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: 'asc' | 'desc'
  orderBy: string
  rowCount: number
}

const headCells: readonly { id: keyof User; numeric: boolean; disablePadding: boolean; label: string }[] = [
  { id: 'student_id', numeric: false, disablePadding: false, label: 'Student ID' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Username' },
  { id: 'dorm_id', numeric: false, disablePadding: false, label: 'Dorm Name' },
  { id: 'room_id', numeric: false, disablePadding: false, label: 'Room Number' },
  { id: 'bed_id', numeric: false, disablePadding: false, label: 'Bed Number' },
  { id: 'round_id', numeric: false, disablePadding: false, label: 'Round Nmae' },
  { id: 'status', numeric: false, disablePadding: false, label: 'status' },
  // { id: 'approve', numeric: false, disablePadding: false, label: 'Approve' }
]

export const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
  const createSortHandler = (property: keyof User) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all users' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
