// ** React Imports
import { Fragment, ReactNode } from 'react'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

interface FooterIllustrationsProp {
  image1?: ReactNode
  image2?: ReactNode
}

// Styled Components
const MaskImg = styled('img')(() => ({
  bottom: 0,
  zIndex: -1,
  width: '100%',
  position: 'absolute'
}))

const Tree1Img = styled('img')(() => ({
  left: 30,
  bottom: 50,
  position: 'absolute',
  opacity: 0.8
}))

const Tree2Img = styled('img')(() => ({
  right: 30,
  bottom: 50,
  position: 'absolute',
  opacity: 0.8
}))

const DormitoryFooter = (props: FooterIllustrationsProp) => {
  // ** Props
  const { image1, image2 } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  if (!hidden) {
    return (
      <Fragment>
        {image1 || (
          <Tree1Img
            alt='tree'
            src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/building_602226.png'
            width={150}
            height={150}
          />
        )}
        <MaskImg alt='mask' src={`/images/pages/auth-v1-mask-${theme.palette.mode}.png`} />
        {image2 || (
          <Tree2Img
            alt='tree-2'
            src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/building_602232%20(1).png'
            width={150}
            height={150}
          />
        )}
      </Fragment>
    )
  } else {
    return null
  }
}

export default DormitoryFooter
