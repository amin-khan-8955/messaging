import { createContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Connection from './pages/Connection'
import Setting from './pages/Setting'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import PrivateLayout from './components/PrivateLayout'
import Message from './pages/Message'
import { Provider, useSelector } from 'react-redux'
import store from './store/store'
import PublicLayout from './components/PublicLayout'
import { Toaster } from 'react-hot-toast'


function App() {

  return (
    <Provider store={store}>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Protect> <PrivateLayout /> </Protect>}>
            <Route path='/' element={<Connection />} />
            <Route path='/message' element={<Message />} />
            <Route path='/setting' element={<Setting />} />
          </Route>

          <Route element={<Public><PublicLayout /></Public>} >
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

const Protect = ({ children }) => {
  const { user } = useSelector(store => store.auth);
  if (user) {
    return children;
  } else {
    return <Navigate to={'/login'} />
  }
}

const Public = ({ children }) => {
  const { user } = useSelector(store => store.auth);
  if (user) {
    return <Navigate to={'/'} />
  } else {
    return children;
  }
}


export default App
