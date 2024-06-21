import { ReactNode } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import MuiAppBar, { AppBarProps } from '@mui/material/AppBar'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'
import { Settings } from 'src/@core/context/settingsContext'
import { Box } from '@mui/material'
import { alpha } from '@mui/material/styles'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  verticalAppBarContent?: (props?: any) => ReactNode
}

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  transition: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 6),
  backgroundColor: alpha(theme.palette.common.white, 0.8),
  color: theme.palette.text.primary,
  minHeight: theme.mixins.toolbar.minHeight + 25, // Increased height by adding 25px
  top: 0,
  position: 'fixed', // Set position to fixed
  width: '100%', // Ensure it spans the full width
  zIndex: theme.zIndex.appBar, // Ensure it stays above other elements
  [theme.breakpoints.down('lg')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    minHeight: theme.mixins.toolbar.minHeight + 25 // Ensure the height increase is also applied for smaller screens
  }
}))

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: '100%',
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
  padding: `${theme.spacing(0)} !important`,
  minHeight: `${theme.mixins.toolbar.minHeight}px !important`,
  transition:
    'padding .25s ease-in-out, box-shadow .25s ease-in-out, backdrop-filter .25s ease-in-out, background-color .25s ease-in-out'
}))

const LayoutAppBar = (props: Props) => {
  const { settings, verticalAppBarContent: userVerticalAppBarContent } = props
  const theme = useTheme()
  const { contentWidth } = settings

  return (
    <AppBar elevation={0} color='default' className='layout-navbar'>
      <Toolbar
        className='navbar-content-container'
        sx={{
          ...(contentWidth === 'boxed' && {
            '@media (min-width:1440px)': { maxWidth: `100%` }
          })
        }}
      >
        {(userVerticalAppBarContent && userVerticalAppBarContent(props)) || null}
      </Toolbar>
    </AppBar>
  )
}

export default LayoutAppBar
