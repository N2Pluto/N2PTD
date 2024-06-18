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
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
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
            <img
              src={'https://img5.pic.in.th/file/secure-sv1/logof3d9597dfa097dbd.png'}
              alt='logo'
              style={{ height: 75, width: 75, paddingTop: 3 }}
            />
            <IconButton
              color='primary'
              onClick={toggleNavWidth}
              sx={{
                fontSize: 'large',
                '& svg': { fontSize: '2rem' },
                padding: 0,
                ml: 1 // Adjust margin left for spacing
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
              <Link href='/dashboard' passHref>
                <StyledLink>
                  <Box
                    component='img'
                    src={'https://img5.pic.in.th/file/secure-sv1/logof3d9597dfa097dbd.png'}
                    sx={{ height: 75, width: 75, pt: 3 }}
                    alt='logo'
                  ></Box>
                  <HeaderTitle variant='h6' sx={{ ml: 3, pt: 6 }}>
                    {themeConfig.templateName}
                  </HeaderTitle>
                </StyledLink>
              </Link>
            )}
            <IconButton
              color='primary'
              onClick={toggleNavWidth}
              sx={{
                fontSize: 'large',
                '& svg': { fontSize: '2rem' },
                padding: 0,
                ml: -2 // Adjust margin left for spacing
              }}
            >
              {navWidth === 100 ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </>
        )}
      </Box>
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
