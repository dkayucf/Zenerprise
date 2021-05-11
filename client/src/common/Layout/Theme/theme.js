import { createMuiTheme } from '@material-ui/core/styles'
import typography from './typography'

const theme = createMuiTheme({
  palette: {
    type: 'light',
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)'
    },
    background: {
      default: '#F4F6F8'
    },
    primary: {
      main: '#428bca',
      light: '#67A2D4',
      dark: '#2E618D',
      contrastText: '#fff'
    },
    secondary: {
      main: '#f0ad4e',
      light: '#F3BD71',
      dark: '#A87936',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#D32F2F',
      contrastText: '#fff'
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff'
    },
    warning: {
      main: '#f0ad4e',
      light: '#F3BD71',
      dark: '#A87936',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    success: {
      main: '#5cb85c',
      light: '#7CC67C',
      dark: '#408040',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    divider: 'rgba(0, 0, 0, 0.12)'
  },
  typography
})

export default theme
