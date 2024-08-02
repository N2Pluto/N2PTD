// ** React Import
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  verticalNavMenuBranding?: (props?: any) => ReactNode
  navWidth: number
  toggleNavWidth: () => void
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out, transform .25s ease-in-out', // Add transform transition
  '&:hover': {
    transform: 'scale(1.2)' // Add scale effect on hover
  }
}))

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const { verticalNavMenuBranding: userVerticalNavMenuBranding, navWidth, toggleNavWidth } = props
  const theme = useTheme() // Use the theme

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: 6 }}>
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
        {navWidth === 150 ? (
          <>
            <Box
              component='img'
              src={'https://img5.pic.in.th/file/secure-sv1/logof3d9597dfa097dbd.png'}
              sx={{
                height: 75,
                width: 75,
                pt: 3,
                transition: 'transform .25s ease-in-out', // Add transform transition
                '&:hover': {
                  transform: 'scale(1.2)' // Add scale effect on hover
                }
              }}
              alt='logo'
            />
            <IconButton
              color='primary'
              onClick={toggleNavWidth}
              sx={{
                fontSize: 'large',
                '& svg': { fontSize: '2rem' },
                padding: 0,
                ml: 1, // Adjust margin left for spacing
                backgroundColor: theme.palette.background.paper, // Background color
                boxShadow: theme.shadows[3], // Box shadow for depth
                borderRadius: theme.shape.borderRadius, // Border radius
                '&:hover': {
                  backgroundColor: theme.palette.action.hover // Hover effect
                }
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        ) : (
          <>
            {userVerticalNavMenuBranding ? (
              userVerticalNavMenuBranding(props)
            ) : (
              <StyledLink>
                <Box
                  component='img'
                  src={'https://img5.pic.in.th/file/secure-sv1/logof3d9597dfa097dbd.png'}
                  sx={{
                    height: 75,
                    width: '100%',
                    pt: 3,
                    transition: 'transform .25s ease-in-out', // Add transform transition
                    '&:hover': {
                      transform: 'scale(1.2)' // Add scale effect on hover
                    }
                  }}
                  alt='logo'
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HeaderTitle variant='body1' sx={{ ml: 1, pt: 6, textAlign: 'center' }}>
                    DORMITORY MENU
                  </HeaderTitle>
                  <IconButton
                    color='primary'
                    onClick={toggleNavWidth}
                    sx={{
                      fontSize: 'large',
                      '& svg': { fontSize: '2rem' },
                      padding: 0,
                      ml: 2, // Adjust margin left for spacing
                      backgroundColor: theme.palette.background.paper, // Background color
                      boxShadow: theme.shadows[3], // Box shadow for depth
                      borderRadius: theme.shape.borderRadius, // Border radius
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover // Hover effect
                      }
                    }}
                  >
                    {navWidth === 100 ? <ChevronRight /> : <ChevronLeft />}
                  </IconButton>
                </Box>
              </StyledLink>
            )}
          </>
        )}
      </Box>
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
