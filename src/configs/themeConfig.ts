import { PaletteMode } from '@mui/material'
import { ContentWidth } from 'src/@core/layouts/types'

type ThemeConfig = {
  mode: PaletteMode
  templateName: string
  routingLoader: boolean
  disableRipple: boolean
  navigationSize: number
  menuTextTruncate: boolean
  contentWidth: ContentWidth
  responsiveFontSizes: boolean
}

const getMode = () => {
  const currentHour = new Date().getHours();
  
  return (currentHour >= 8 && currentHour <= 21) ? 'light' : 'dark';
}

const themeConfig: ThemeConfig = {
  // ** Layout Configs
  templateName: 'Walailak University' /* App Name */,
  mode: getMode() /* light | dark */,
  contentWidth: 'boxed' /* full | boxed */,

  // ** Routing Configs
  routingLoader: true /* true | false */,

  // ** Navigation (Menu) Configs
  menuTextTruncate: true /* true | false */,
  navigationSize: 250 /* Number in PX(Pixels) /*! Note: This is for Vertical navigation menu only */,

  // ** Other Configs
  responsiveFontSizes: true /* true | false */,
  disableRipple: false /* true | false */
}

export default themeConfig
