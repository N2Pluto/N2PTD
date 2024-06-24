import React, { useState } from 'react'
import { Settings } from 'src/@core/context/settingsContext'
import { NavLink, NavSectionTitle, VerticalNavItemsType } from 'src/@core/layouts/types'

// ** Custom Menu Components
import VerticalNavLink from './VerticalNavLink'
import VerticalNavSectionTitle from './VerticalNavSectionTitle'

// ** MUI Components
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ChevronRight from 'mdi-material-ui/ChevronRight'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Theme Components
import { useTheme } from '@mui/material/styles'

interface Props {
  settings: Settings
  navWidth: number
  navVisible?: boolean
  groupActive: string[]
  currentActiveGroup: string[]
  verticalNavItems?: VerticalNavItemsType
  saveSettings: (values: Settings) => void
  setGroupActive: (value: string[]) => void
  setCurrentActiveGroup: (item: string[]) => void
}

const VerticalNavItems = (props: Props) => {
  const { verticalNavItems, navWidth } = props
  const [open, setOpen] = useState<string[]>([])
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [menuItems, setMenuItems] = useState<NavLink[]>([])
  const theme = useTheme()

  const handleClick = (title: string, children?: NavLink[], event?: React.MouseEvent<HTMLElement>) => {
    if (navWidth === 150 && children) {
      setMenuAnchor(event?.currentTarget || null)
      setMenuItems(children)
    } else {
      setOpen(prevOpen => (prevOpen.includes(title) ? [] : [title]))
    }
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setMenuItems([])
  }

  const RenderMenuItems = verticalNavItems?.map((item: NavLink | NavSectionTitle, index: number) => {
    if ((item as NavSectionTitle).sectionTitle) {
      return (
        <React.Fragment key={index}>
          <ListItem
            button
            onClick={event =>
              handleClick((item as NavSectionTitle).sectionTitle, (item as NavSectionTitle).children, event)
            }
            style={{
              backgroundColor: open.includes((item as NavSectionTitle).sectionTitle)
                ? theme.palette.action.selected
                : theme.palette.common.white,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: navWidth === 150 ? 'column' : 'row',
                alignItems: navWidth !== 150 ? 'center' : 'start'
              }}
            >
              <ListItemIcon
                style={{
                  marginLeft: navWidth === 150 ? '46px' : '18px', // Adjusted for icon alignment
                  marginRight: navWidth === 150 ? 0 : '16px',
                  marginBottom: navWidth === 150 ? '8px' : 0
                }}
              >
                {React.createElement((item as NavSectionTitle).icon)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    style={{
                      fontSize: navWidth === 150 ? '0.75rem' : 'inherit',
                      marginLeft: navWidth === 150 ? '30px' : '0', // Adjust marginLeft when navWidth is 150
                      textAlign: navWidth !== 150 ? 'center' : 'left'
                    }}
                  >
                    {(item as NavSectionTitle).sectionTitle}
                  </Typography>
                }
              />
            </div>
            <ListItemIcon
              style={{
                marginRight: navWidth === 150 ? '-6px' : '16px',
                color: theme.palette.text.primary
              }}
            >
              {open.includes((item as NavSectionTitle).sectionTitle) ? <ExpandMore /> : <ChevronRight />}
            </ListItemIcon>
          </ListItem>
          {navWidth === 150 ? null : (
            <Collapse in={open.includes((item as NavSectionTitle).sectionTitle)} timeout='auto' unmountOnExit>
              <List
                component='div'
                disablePadding
                style={{
                  marginLeft: '12px'
                }}
              >
                {(item as NavSectionTitle).children?.map((childItem: NavLink, childIndex: number) => (
                  <VerticalNavLink
                    key={childIndex}
                    item={childItem}
                    settings={props.settings}
                    navVisible={props.navVisible}
                    toggleNavVisibility={() => {}}
                    navWidth={navWidth}
                  />
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      )
    } else {
      return (
        <VerticalNavLink
          key={index}
          item={item as NavLink}
          settings={props.settings}
          navVisible={props.navVisible}
          toggleNavVisibility={() => {}}
          navWidth={navWidth}
        />
      )
    }
  })

  return (
    <>
      <List>{RenderMenuItems}</List>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          style: {
            position: 'fixed',
            top: '10%', 
            left: 'calc(91%)', 
            transform: 'none',
            margin: 0,
          }
        }}
      >
        {menuItems.map((childItem, childIndex) => (
          <MenuItem key={childIndex} onClick={handleMenuClose}>
            <VerticalNavLink
              key={childIndex}
              item={childItem}
              settings={props.settings}
              navVisible={props.navVisible}
              toggleNavVisibility={() => {}}
              navWidth={navWidth}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default VerticalNavItems
