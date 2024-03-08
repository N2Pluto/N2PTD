
import Grid, { GridProps } from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Stack, Step, StepConnector, StepIconProps, StepLabel, Stepper, stepConnectorClasses, styled } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import BedIcon from '@mui/icons-material/Bed';
import SummarizeIcon from '@mui/icons-material/Summarize';


const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const SuccessฺฺBarResult = () => {

  const steps = ['Reservation', 'Building', 'Room' ,'Bed', 'summarize']

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: 'linear-gradient(90deg, rgba(145,85,253,1) 0%, rgba(208,85,253,0.31169030112044815) 81%, rgba(242,203,252,1) 100%)'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: 'linear-gradient(90deg, rgba(145,85,253,1) 0%, rgba(208,85,253,0.31169030112044815) 81%, rgba(242,203,252,1) 100%)'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1
    }
  }))

  const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient(90deg, rgba(145,85,253,1) 0%, rgba(208,85,253,0.31169030112044815) 81%, rgba(242,203,252,1) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient(90deg, rgba(145,85,253,1) 0%, rgba(208,85,253,0.31169030112044815) 81%, rgba(242,203,252,1) 100%)',
    }),
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props

    const icons: { [index: string]: React.ReactElement } = {
      1: <SettingsIcon />,
      2: <CorporateFareIcon />,
      3: <BedroomParentIcon />,
      4: <BedIcon />,
      5: <SummarizeIcon />
    }

    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    )
  }

  return (<Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 3 }}>
    <Card>
      <CardContent>
        <Stack sx={{ width: '100%' }} spacing={4}>
          <Stepper alternativeLabel activeStep={5} connector={<ColorlibConnector />}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </CardContent>
    </Card>
  </Grid>
  )
}

export default SuccessฺฺBarResult
