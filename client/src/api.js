import axios from 'axios'
import { any, equals, assocPath } from 'ramda'

const instance = axios.create()

instance.interceptors.request.use(
  async function (config) {
    const { method } = config
    const requiresCSRFtoken = any(equals(method))([
      'post',
      'put',
      'patch',
      'delete',
    ])
    if (requiresCSRFtoken) {
      let csrfTokenResponse = await fetch('/api/getCSRFToken', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      })
      let parsedToken = await csrfTokenResponse.json()

      return assocPath(
        ['headers', 'X-CSRF-TOKEN'],
        parsedToken?.CSRFToken,
        config
      )
    } else {
      return config
    }
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

export default instance
