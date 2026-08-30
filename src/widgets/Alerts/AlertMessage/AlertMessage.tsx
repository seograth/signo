import React, { useContext } from 'react'
import { AlertsContext } from '../AlertsProvider/AlertsContext'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' sx={{ fill: 'white' }} {...props} />
})

const AlertMessage = () => {
  // alert types can be error,warning,info,success
  const { alertOpen, setAlertOpen, alertProperties } = useContext(AlertsContext)

  return (
    <Snackbar
      open={alertOpen}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={6000}
      onClose={() => {
        setAlertOpen(false)
      }}
    >
      <Alert
        onClose={() => setAlertOpen(false)}
        severity={alertProperties.type}
        sx={{ width: '100%' }}
      >
        {alertProperties.message}
      </Alert>
    </Snackbar>
  )
}

export default AlertMessage
