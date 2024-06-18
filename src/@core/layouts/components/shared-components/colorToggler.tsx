// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import { Button } from '@mui/material'

// ** Type Imports
import { PaletteMode } from '@mui/material'
import { ThemeColor } from 'src/@core/layouts/types'

// Import DefaultPalette function
import DefaultPalette from 'src/@core/theme/palette'

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const ModeColor = () => {
  const [color, setColor] = useState<string>('')

  // Define state and functions
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  // Function to handle color change
  const handleColorChange = (color: string) => {
    setColor(color)
  }

  // Get the palette
  const mode: PaletteMode = 'light' // or 'dark', this should be dynamic based on your theme settings
  const themeColor: ThemeColor = 'primary' // this should also be dynamic
  const palette = DefaultPalette(mode, themeColor)

  const colors = [
    palette.primary.main,
    palette.secondary.main,
    palette.success.main,
    palette.error.main,
    palette.warning.main
  ]

  // Render ModeColor component
  return (
    <Fragment>
      <IconButton
        color='inherit'
        aria-haspopup='true'
        onClick={handleDropdownOpen}
        aria-controls='customized-menu'
        style={{ backgroundColor: color }} // Apply the selected color to the button
      >
        <ColorLensIcon />
      </IconButton>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <StyledMenuItem disableRipple>
          <Typography sx={{ fontWeight: 600 }}>Color</Typography>
        </StyledMenuItem>
        <StyledMenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        >
          {colors.map((color, index) => (
            <Button
              key={index}
              variant='contained'
              sx={{
                width: '100%',
                backgroundColor: color,
                '&:hover': {
                  backgroundColor: color // You can add logic to lighten/darken the color on hover if needed
                }
              }}
              onClick={() => handleColorChange(color)}
            ></Button>
          ))}
        </StyledMenuItem>
      </StyledMenu>
    </Fragment>
  )
}

export default ModeColor
