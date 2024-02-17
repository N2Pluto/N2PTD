import * as React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'


export default function LoadingButtonsTransition() {
  const [loading, setLoading] = React.useState(true)
  function handleClick() {
    setLoading(true)
  }

  return (
    <div>
      <FormControlLabel
        sx={{
          display: 'block'
        }}
        control={<Switch checked={loading} onChange={() => setLoading(!loading)} name='loading' color='secondary' />}
        label=''
      />
    </div>
  )
}
