import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom'
import ProvideAuth from './contexts/auth'
import { PrivateRoute, ProtectedRoutes } from './routes/protected'
import { PublicRoutes } from './routes/public'
import Layout from './common/Layout/'

function App() {
  return (
    <Router>
      <ProvideAuth>
        <Layout>
          <Switch>
            <PrivateRoute path="/auth">
              <ProtectedRoutes />
            </PrivateRoute>
            <PublicRoutes />
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </Layout>
      </ProvideAuth>
    </Router>
  )
}

function NoMatch() {
  const location = useLocation()

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  )
}

export default App
