import React, {
  useContext,
  createContext,
  useEffect,
  useCallback,
  useState,
  forwardRef,
} from 'react'
import makeStyles from '@mui/styles/makeStyles'
import PropTypes from 'prop-types'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const Alert = forwardRef((props, ref) => (
  <MuiAlert elevation={6} variant="filled" {...props} ref={ref} />
))

Alert.displayName = 'AlertSnackbar'

const snackbarContext = createContext({
  // eslint-disable-next-line no-unused-vars
  handleSnackbar: (message, severity) => {},
})

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
}))

const SnackbarProvider = ({ children }) => {
  const classes = useStyles()
  const [snackPack, setSnackPack] = useState([])
  const [open, setOpen] = useState(false)
  const [messageInfo, setMessageInfo] = useState(undefined)

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] })
      setSnackPack((prev) => prev.slice(1))
      setOpen(true)
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false)
    }
  }, [snackPack, messageInfo, open])

  const handleSnackbar = useCallback((message, severity) => {
    setSnackPack((prev) => [
      ...prev,
      { message, key: new Date().getTime(), severity },
    ])
  }, [])

  const handleExited = useCallback(() => {
    setMessageInfo(undefined)
  }, [])

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }, [])

  return (
    <snackbarContext.Provider value={handleSnackbar}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionProps={{
          onExit: handleExited,
        }}
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={handleClose}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        }
      >
        <Alert severity={messageInfo ? messageInfo.severity : undefined}>
          {messageInfo ? messageInfo.message : undefined}
        </Alert>
      </Snackbar>
    </snackbarContext.Provider>
  )
}

SnackbarProvider.propTypes = {
  children: PropTypes.node,
}

export const useSnackbar = () => useContext(snackbarContext)
export default SnackbarProvider
