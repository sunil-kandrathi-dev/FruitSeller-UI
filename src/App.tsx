import { BrowserRouter } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import AppRoutes from './App/AppRoutes'
import RouteErrorBoundary from './App/RouteErrorBoundary'

function RoutedApp() {
  const location = useLocation()

  return (
    <RouteErrorBoundary key={location.pathname} routePath={location.pathname}>
      <AppRoutes />
    </RouteErrorBoundary>
  )
}

function App() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  )
}

export default App
