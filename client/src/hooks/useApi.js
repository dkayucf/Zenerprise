
import { useReducer, useCallback } from 'react'
import axios from 'axios'
import { assoc, mergeRight, map, flatten, pluck, prop, pathOr, keys, zipObj, mapObjIndexed, reduce } from 'ramda'

const fetching = (requestKey) => ({ type: 'FETCHING', requestKey })
const success = (response) => ({ type: 'SUCCESS', response })
const error = (response, requestKey, resourceKey) => ({ type: 'ERROR', response, requestKey, resourceKey })
const reset = (requestKey) => ({ type: 'RESET', requestKey })

const defaultState = {
  isIdle: true,
  isLoading: false,
  hasError: false,
  isSuccessful: false
}
const initializeState = (initialState) => reduce((acc, val) =>  mergeRight(acc, { [val]: defaultState }), {}, initialState)

const reducer = (state, { type, response, requestKey } = {}) => {
  const toObject = (arr, previousResponseKeys, previousResponse) => arr.reduce((a, b, index) => ({ ...a, [previousResponseKeys.length + index]: b }), previousResponse)
  const indexedObject = (obj, previousResponseKeys, previousResponse) => (assoc(previousResponseKeys.length + 1, obj, previousResponse))
  const indexedResponse = (value, previousResponseKeys, previousResponse) => Array.isArray(value) ? toObject(value || [], previousResponseKeys, previousResponse) : indexedObject(value, previousResponseKeys, previousResponse)

  switch (type) {
    case 'FETCHING':
      return {
        ...state,
        [requestKey] : {
          isIdle: false,
          isLoading: true,
          hasError: false,
          isSuccessful: false,
          response: pathOr(null, [requestKey, 'response'], state),
          resources: pathOr(null, [requestKey, 'resources'], state)
        }
      }
    case 'SUCCESS': {
      return {
        ...state,
        ...mapObjIndexed((value, key) => {
          const previousResponseKeys = pathOr([], [key, 'resources', 'keys'], state)
          const previousResponse = pathOr({}, [key, 'resources', 'values'], state)

          return {
            isIdle: true,
            isLoading: false,
            hasError: false,
            isSuccessful: true,
            response: response[key],
            resources: {
              keys: keys(indexedResponse(value, previousResponseKeys, previousResponse)),
              values: indexedResponse(value, previousResponseKeys, previousResponse)
            }
          }
        }, response)
      }
    }
    case 'ERROR':
      return {
        ...state,
        [requestKey] : {
          isIdle: true,
          isLoading: false,
          hasError: true,
          isSuccessful: false,
          response,
          resources: pathOr(null, [requestKey, 'resources'], state)
        }
      }
    case 'RESET':
      return {
        ...state,
        [requestKey] : defaultState
      }
    default:
      return {
        ...state,
        [requestKey] : defaultState
      }
  }
}

const useApiRequest = (initialState = [], isAuth) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    initializeState
  )

  const makeRequest = useCallback(
    async (config) => {
      let configs = flatten([config])

      try {
        const setupRequest = (requestConfig) => {
          dispatch(fetching(prop('requestKey', requestConfig)))
          return axios.request(mergeRight({
            method: 'GET',
            baseURL: isAuth ? '/apix' : '/api'
          }, requestConfig))
        }
        
        const response = await Promise.all(map(setupRequest, configs))

        const data = pluck('data', response)
        const configKeys = pluck('requestKey', configs)
        const zippedResponse = zipObj(configKeys, data)
        dispatch(success(zippedResponse))

        return zippedResponse
      } catch (e) {
        configs.forEach((config) => {
          const requestKey = prop('requestKey', config)
          dispatch(error(e, requestKey))
        })
        return e
      } 
    },
    [isAuth]
  )

  // Can be called to clear the request state, e.g. after a user tries to update something, fails, then closes the dialog
  const resetRequest = useCallback((requestKey) => dispatch(reset(requestKey)), [])
  const useResource = useCallback((requestKey) => prop(requestKey, state), [state])

  return {
    makeRequest,
    resetRequest,
    useResource
  }
}

export {
  useApiRequest 
}