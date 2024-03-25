import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Result from './screens/Result'
import PageNotFound from './screens/PageNotFound'
import AdminLogin from './screens/admin/AdminLogin'
import AdminPanel from './screens/admin/AdminPanel'

const App = () => {
  return (
    <main className="p-10 text-gray-800">
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/result' element={<Result/>} />
          <Route path='/admin-login' element={<AdminLogin/>} />
          <Route path='/admin-panel' element={<AdminPanel/>} />
          <Route path='*' element={<PageNotFound/>} />
        </Routes>
    </main>
  )
}

export default App