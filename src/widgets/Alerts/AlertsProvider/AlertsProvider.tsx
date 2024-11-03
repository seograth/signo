import React, { createContext, useState } from 'react'
import { AlertColor } from '@mui/material/Alert'

type AlertsContextState = {
  alertOpen: boolean
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>
  alertProperties: {
    type: AlertColor | undefined
    message: string
  }
  setAlertProperties: React.Dispatch<
    React.SetStateAction<{
      type: AlertColor | undefined
      message: string
    }>
  >
}

const contextDefaultValues: AlertsContextState = {
  alertOpen: false,
  setAlertOpen: () => {},
  alertProperties: {
    type: undefined,
    message: '',
  },
  setAlertProperties: () => {},
}

export const AlertsContext = createContext<AlertsContextState>(contextDefaultValues)

const AlertsProvider = ({ children }: any) => {
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
