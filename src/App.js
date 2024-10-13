import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Login from './components/Login'
import { auth } from './firebase'
import { useAuth } from './context/GlobalState'
import Home from './components/Home'
import Checkout from './components/Checkout'
import Payment from './components/Payment'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'



const App = () => {
  const {dispatch} = useAuth()
  const stripePromise = loadStripe("pk_test_51Q8I3PRsp5RDj2xzJhUPjAk8YwuGLQEl5KsWNgU5WDeusWL9vYsf4FoAermr0z8fBKj0UOvJBFUJhjx8hm2AAnoc00E5uTQOM0")
  useEffect(() =>{
    auth.onAuthStateChanged((authUser) =>{
      if(authUser){
        dispatch({
          type:"SET_USER",
          user: authUser,
        })
      }else{
        dispatch({
          type:"SET_USER",
          user: null,
        })
      }
    })
  },[])
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<>
          <Header/>
          <Home/>
          </>}/>
        <Route path='/checkout' element={<>
        <Header/>
        <Checkout/>
        </>}/>
        <Route path='/payment' element={<>
        <Header/>
        <Elements stripe={stripePromise}>
        <Payment/>
        </Elements>
        </>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='*' element={<h1>Page Not Found</h1>}/>
      </Routes>
    </div>
  )
}

export default App

