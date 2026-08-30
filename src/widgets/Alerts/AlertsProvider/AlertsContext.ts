import { createContext } from 'react'
import { AlertColor } from '@mui/material/Alert'

export type AlertsContextState = {
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

export const contextDefaultValues: AlertsContextState = {
  alertOpen: false,
  setAlertOpen: () => {},
  alertProperties: {
    type: undefined,
    message: '',
  },
  setAlertProperties: () => {},
}

export const AlertsContext = createContext<AlertsContextState>(contextDefaultValues)
