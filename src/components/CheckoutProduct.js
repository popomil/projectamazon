import React from 'react'
import "./CheckoutProduct.css"
import starIcon from "../images/icons/star.png"
import { useAuth } from '../context/GlobalState';
const CheckoutProduct = ({id, title,price,rating,image}) => {
  const { dispatch } = useAuth();
  const removeFromBasket = () =>{
    dispatch({
    type: "REMOVE_FROM_BASKET",
    id:id
  })
  }
  return (
    <>
    <div className="checkoutProduct">
      <img className="checkoutProduct-image" src={image} alt="" />
      <div className="checkoutProduct-info">
        <p className="checkoutProduct-title">{title}</p>
        <p className="checkoutProduct-price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="checkoutProduct-rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p className='product-rating'>
                <img src={starIcon} alt="" />
              </p>
            ))}
        </div>
          <button onClick={removeFromBasket}>Remove from Basket</button>
      </div>
    </div>
    </>
  )
}

export default CheckoutProduct
