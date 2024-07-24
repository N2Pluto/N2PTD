import { ElementType, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import themeConfig from 'src/configs/themeConfig'
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'
import UserIcon from 'src/layouts/components/UserIcon'
import { handleURLQueries } from 'src/@core/layouts/utils'

interface Props {
  item: NavLink
  settings: Settings
  navVisible?: boolean
  toggleNavVisibility: () => void
  navWidth: number // Add this line
}

const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: '100%',
  borderTopRightRadius: 100,
  borderBottomRightRadius: 100,
  color: theme.palette.text.primary,
  padding: theme.spacing(2.25, 3.5),
  transition: 'opacity .25s ease-in-out, transform .25s ease-in-out', // Add transition for transform
  '&:hover': {
    transform: 'scale(1.1)' // Add scale effect on hover
  },
  '&.active, &.active:hover': {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
  },
  '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
    color: `${theme.palette.common.white} !important`
  }
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility, navWidth }: Props) => {
  const router = useRouter()
  const IconTag: ReactNode = item.icon
  const theme = useTheme()
  const isSmallScreen = useMediaQuery('(max-width:150px)')

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true
    } else {
      return false
    }
  }

  return (
    <ListItem
      disablePadding
      className='nav-link'
      disabled={item.disabled || false}
      sx={{ mt: 1.5, px: '0 !important' }}
    >
      <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
        <MenuNavLink
          component={'a'}
          className={isNavLinkActive() ? 'active' : ''}
          {...(item.openInNewTab ? { target: '_blank' } : null)}
          onClick={e => {
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
            if (navVisible) {
              toggleNavVisibility()
            }
          }}
          sx={{
            pl: 5.5,
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
            display: 'flex',
            flexDirection: navWidth === 150 ? 'column' : 'row',
            alignItems: navWidth === 150 ? 'center' : 'flex-start',
            borderTopRightRadius: navWidth === 150 ? 0 : undefined,
            borderBottomRightRadius: navWidth === 150 ? 0 : undefined,
            borderRadius: navWidth === 150 ? 10 : undefined // Set borderRadius to 10 when navWidth is 150
          }}
        >
          <ListItemIcon
            sx={{
              mr: navWidth === 150 ? 5 : 2.5,
              mb: navWidth === 150 ? 1 : 0,
              color: 'text.primary',
              transition: 'margin .25s ease-in-out'
            }}
          >
            <UserIcon icon={IconTag} />
          </ListItemIcon>

          {!isSmallScreen && (
            <MenuItemTextMetaWrapper
              sx={{
                display: 'flex',
                flexDirection: navWidth === 150 ? 'column' : 'row',
                alignItems: navWidth === 150 ? 'center' : 'flex-start',
                textAlign: navWidth === 150 ? 'center' : 'left',
                justifyContent: 'center'
              }}
            >
              <Typography
                {...(themeConfig.menuTextTruncate && { noWrap: true })}
                sx={{
                  fontSize: navWidth === 150 ? '0.75rem' : 'inherit',
                  marginLeft: navWidth === 150 ? '20px' : '7px',
                  textAlign: navWidth !== 150 ? 'left' : 'left',
                  width: '100%'
                }}
              >
                {item.title}
              </Typography>
              {item.badgeContent && navWidth !== 150 && (
                <Chip
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    marginLeft: 1.25,
                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                  }}
                />
              )}
            </MenuItemTextMetaWrapper>
          )}
        </MenuNavLink>
      </Link>
    </ListItem>
  )
}

export default VerticalNavLink
