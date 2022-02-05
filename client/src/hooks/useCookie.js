import { useCallback, useMemo } from 'react'
import * as Cookies from 'js-cookie'

const defaultCookie = {
  user: {
    isAuth: false,
    routes: [],
  },
}

// Hook
export function useCookie() {
  const removeCookie = useCallback(() => {
    Cookies.remove('session')
    Cookies.set('session', defaultCookie)
  }, [])

  const setSessionCookie = useCallback((session) => {
    Cookies.remove('session')
    Cookies.set('session', session)
  }, [])

  const getSessionCookie = useCallback(() => {
    const sessionCookie = Cookies.get('session')

    if (sessionCookie === undefined) {
      return defaultCookie
    } else {
      return JSON.parse(sessionCookie)
    }
  }, [])

  return useMemo(
    () => ({
      sessionCookie: getSessionCookie(),
      getSessionCookie,
      setSessionCookie,
      removeCookie,
    }),
    [getSessionCookie, setSessionCookie, removeCookie]
  )
}
