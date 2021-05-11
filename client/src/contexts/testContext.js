
import React, { useContext, createContext, useEffect, useCallback, useState, useMemo } from "react"
import PropTypes from 'prop-types'
import { useApiRequest, useRequestContext } from '../hooks/useApi'

const testContext = createContext({
  useResponse: () => {},
  fetchData: () => {},
  testState: true,
  setTestState: () => {}
})

const ProvideTest = ({ children }) => {
  const { makeRequest, useResource } = useApiRequest()
  const [testState, setTestState] = useState(true)
  

    const fetchData = useCallback(async () => {
      const requests = [
        { 
            url: 'https://jsonplaceholder.typicode.com/comments',
            requestKey: 'comments'
        },
        // { 
        //     url: 'https://jsonplaceholder.typicode.com/posts/1/comments',
        //     requestKey: 'post-comments'
        // },
        // { 
        //     url: 'https://jsonplaceholder.typicode.com/posts/1',
        //     requestKey: 'user-post'
        // },
        // { 
        //     url: 'https://jsonplaceholder.typicode.com/posts/2',
        //     requestKey: 'user-post'
        // },
    ]
        
        await makeRequest(requests)
    }, [makeRequest])

    const comments = useResource('comments')
    
    useEffect(() => {
        fetchData()
    }, [fetchData])

    const memoizedValue = useMemo(() => ({ fetchData, testState, setTestState }), [testState, fetchData])
  return (
    <testContext.Provider value={memoizedValue}>
      {children}
    </testContext.Provider>
  )
}

ProvideTest.propTypes = {
    children: PropTypes.node
  }
  
export const useTest = () => useContext(testContext)
export default ProvideTest
