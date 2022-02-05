import { useReducer, useMemo, useCallback } from 'react'

const initialState = {
  status: 'idle',
  value: null,
  error: null,
}

function asyncReducer(state, action) {
  switch (action.type) {
    case 'idle':
      return {
        status: 'idle',
        value: null,
        error: null,
      }
    case 'pending':
      return {
        status: 'pending',
        value: null,
        error: null,
      }
    case 'success':
      return {
        status: 'success',
        value: action.payload,
        error: null,
      }
    case 'error':
      return {
        status: 'error',
        value: null,
        error: action.payload,
      }
    default:
      return initialState
  }
}

export const useAsync = (asyncFunction) => {
  const [state, dispatch] = useReducer(asyncReducer, initialState)

  const makeRequest = useCallback(
    async (...props) => {
      try {
        dispatch({ type: 'pending' })

        const response = await asyncFunction(...props)

        dispatch({ type: 'success', payload: response })
        return response
      } catch (error) {
        dispatch({ type: 'error', payload: error })
      }
      return
    },
    [asyncFunction]
  )

  const resetRequest = useCallback(() => {
    dispatch({ type: 'idle' })
  }, [])

  const value = useMemo(() => {
    return [state, makeRequest, resetRequest]
  }, [state, makeRequest, resetRequest])

  return value
}
