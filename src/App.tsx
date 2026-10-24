import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './App/AppRoutes' 

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App