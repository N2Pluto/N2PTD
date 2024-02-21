// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TypographyTexts from 'src/views/typography/TypographyTexts'
import TypographyHeadings from 'src/views/typography/TypographyHeadings'
import LayoutAuth from 'src/layouts/LayoutAuth'

const TypographyPage = () => {
  return (
    <LayoutAuth>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TypographyHeadings />
        </Grid>
        <Grid item xs={12}>
          <TypographyTexts />
        </Grid>
      </Grid>
    </LayoutAuth>
  )
}

export default TypographyPage
