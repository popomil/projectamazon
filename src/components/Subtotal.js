import React from 'react'
import CurrencyFormat from 'react-currency-format'
import { useAuth } from '../context/GlobalState'
import { getBasketTotal } from '../context/AppReducer'
import "./Subtotal.css"
import { useNavigate } from 'react-router-dom'
const Subtotal = () => {
    const {basket} = useAuth()
    const navigate = useNavigate()
  return (
    <div className='subtotal'>
      <CurrencyFormat renderText={(value) => (
        <>
        <p>
            subtotal ({basket.length} items): <strong>{value}</strong>
        </p>
        <smail className="subtotal__gift">
            <input type='checkbox'/> This order contains a gift
        </smail>
        </>
      )}
      decimalScale={2}
      value={getBasketTotal(basket)}
      displayType={"text"}
      thousandSeparator={true}
      prefix={"$"}
      />
      <button onClick={() => navigate("/payment")}>Proceed To Checkout</button>
    </div>
  )
}

export default Subtotal
