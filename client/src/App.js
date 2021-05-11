import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom"
import ProvideAuth  from './contexts/provideAuth'
import { PrivateRoute, ProtectedRoutes } from './routes/protected'
import { PublicRoutes } from './routes/public'
import Layout from './common/Layout/'

function App() {
  return (
    <ProvideAuth>
      <Router>
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
      </Router>
    </ProvideAuth>
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
