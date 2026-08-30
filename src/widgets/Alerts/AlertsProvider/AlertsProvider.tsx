import React, { useState } from 'react'
import { AlertColor } from '@mui/material/Alert'
import { AlertsContext, contextDefaultValues } from './AlertsContext'

const AlertsProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertOpen, setAlertOpen] = useState<boolean>(contextDefaultValues.alertOpen)
  const [alertProperties, setAlertProperties] = useState<{
    type: AlertColor | undefined
    message: string
  }>(contextDefaultValues.alertProperties)

  return (
    <AlertsContext.Provider
      value={{
        alertOpen,
        setAlertOpen,
        alertProperties,
        setAlertProperties,
      }}
    >
      {children}
    </AlertsContext.Provider>
  )
}

export default AlertsProvider
