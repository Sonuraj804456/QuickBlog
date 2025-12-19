import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Blog from './components/pages/Blog'
import Layout from './components/pages/admin/Layout'
import Dashboard from './components/pages/admin/Dashboard'
import ListBlog from './components/pages/admin/ListBlog'
import Comments from './components/pages/admin/Comments'
import AddBlog from './components/pages/admin/AddBlog'
import Login from './components/admin/Login'
import 'quill/dist/quill.snow.css'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'


const App = () => {
  const {token} = useAppContext();
  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/blog/:id' element={<Blog/>}/>
        <Route path='/admin' element={token ? <Layout/> : <Login/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='addBlog' element={<AddBlog/>}/>
          <Route path='listBlog' element={<ListBlog/>}/>
          <Route path='comments' element={<Comments/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
