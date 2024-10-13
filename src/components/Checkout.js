import React from 'react'
import "./Checkout.css"
import checkoutImg from "../images/checkoutAd.jpg"
import { useAuth } from '../context/GlobalState'
import Subtotal from './Subtotal'
import CheckoutProduct from './CheckoutProduct'

const Checkout = () => {
    const {user,basket, dispatch} = useAuth()
    const removeAll = () =>{
      dispatch({
        type:"EMPTY_BASKET",
        basket:[]
      })
    }
  return (
    <>
    <div className='checkout'>
      <div className='checkout-left'>
        <img className='checkout-ad' src={checkoutImg} alt=''/>
      <h3>Hello, {user?.email}</h3>
      <h2 className='checkout-title'>Your Shoping Basket</h2>
      { 
  basket.length > 0 ? (
    <>
      {basket.map((item) => (
        <CheckoutProduct
          key={item.id}
          id={item.id} 
          image={item.image}
          title={item.title} 
          price={item.price}
          rating={item.rating}
        />
      ))}
      <button className='remove-all' onClick={removeAll}>Remove All Basket</button>
    </>
  ) : (
    <p className='massege-basket'>  
      You have no items in your basket. To buy one or more items, click "Add to basket".
    </p>
  ) 
}

 
      </div>
      <div className='checkout-right'>
      <Subtotal/>
      </div>
    </div>
    </>
  )
}

export default Checkout
