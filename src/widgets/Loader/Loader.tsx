import { Backdrop } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

type LoaderProps = {
  isLoading: boolean
  children?: string | JSX.Element | JSX.Element[]
}

function Loader({ isLoading, children }: LoaderProps) {
  return (
    <>
      {isLoading === false ? (
        children
      ) : (
        <Backdrop
          open={isLoading}
          sx={{ color: 'primary', zIndex: (theme) => theme.zIndex.appBar + 1 }}
        >
          <CircularProgress color='primary' />
        </Backdrop>
      )}
    </>
  )
}

export default Loader
