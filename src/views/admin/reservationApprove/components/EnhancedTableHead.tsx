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
  dorm_id: number
  room_id: number
  bed_id: number
  user_id: string
  round_id: number
  status: string
  created_at: string
}

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: 'asc' | 'desc'
  orderBy: string
  rowCount: number
  tab: string
}

export const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props

  const headCells: readonly { id: keyof User; numeric: boolean; disablePadding: boolean; label: string }[] = [
    { id: 'id', numeric: false, disablePadding: true, label: 'Student ID' },
    { id: 'user_id', numeric: false, disablePadding: false, label: 'User Name' },
    { id: 'dorm_id', numeric: false, disablePadding: false, label: 'Dormitory' },
    { id: 'room_id', numeric: false, disablePadding: true, label: 'Room No. ' },
    { id: 'bed_id', numeric: false, disablePadding: true, label: 'Bed No.' },
    { id: 'round_id', numeric: false, disablePadding: false, label: 'Round Name' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    { id: 'created_at', numeric: false, disablePadding: false, label: 'Created At' },
    ...(props.tab === 'pending' ? [{ id: 'option', numeric: false, disablePadding: false, label: 'Option' }] : [])
  ]

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
