import React from 'react'
import Navbar from '../Navbar'
import Header from '../Header'
import BlogList from '../BlogList'
import Newsletter from '../Newsletter'
import Footer from '../Footer'

const Home = () => {
  return (
    <>
        <Navbar/>
        <Header/>
        <BlogList/>
        <Newsletter/>
        <Footer/>
    </>
  )
}

export default Home
