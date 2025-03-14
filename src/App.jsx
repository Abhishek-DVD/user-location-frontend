import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from './components/Body'
import Login from './components/Login'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import LocationTracker from './components/LocationTracker'
import AdminView from './components/AdminView'
import AdminBody from './components/AdminBody'

const App = () => {
  return (
    <>
      <Provider store={appStore}>
          <BrowserRouter basename='/'>
          <Routes>
            <Route path="/" element={<Body/>}>
            <Route path="/login" element={<Login/>}/>
              <Route path="/" element={<LocationTracker/>}/>
            </Route>
            <Route path="/admin" element={<AdminBody/>}>
            <Route path="/admin/login" element={<AdminLogin/>}/>
              <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
              <Route path="/admin/view/:userId" element={<AdminView />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App