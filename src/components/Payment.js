
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { React, useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/GlobalState";
import CheckoutProduct from "./CheckoutProduct";
import axios from "./axios";
import "./Payment.css";
import { getBasketTotal } from "../context/AppReducer";
import { doc, setDoc } from "firebase/firestore";
import { dp } from "../firebase";

const Payment = () => {
  const { basket, user, dispatch } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
console.log(user)
  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const response = await axios.post(`/payments/create?total=${getBasketTotal(basket) * 100}`);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
        setError("Unable to fetch payment details. Please try again.");
      }
    };
    getClientSecret();
  }, [basket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    if (!clientSecret) {
      setError("Client secret is not available. Please try again.");
      return;
    }

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        const ref = doc(dp, "users", user?.id, "orders",paymentIntent.id);
        setDoc(ref, {
          basket:basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        })
        setSucceeded(true);
        setError(null);
        setProcessing(false);
        dispatch({ type: "EMPTY_BASKET" });
        navigate("/orders", { replace: true });
      })
      .catch((err) => {
        setError(err.message);
        setProcessing(false);
      });
  };
  const handleChange = (e) => {
    setDisabled(e.empty); // Enable the button if the card details are complete
    setError(e.error ? e.error.message : ""); // Update the error state if there's an error
  };

  return (
    <div className="payment">
      <div className="payment-container">
        <h1>
          Checkout (<Link to="/checkout">{basket.length} items</Link>)
        </h1>
        {/* Delivery Address */}
        <div className="payment-section">
          <div className="payment-title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment-address">
            <p>{user?.email}</p>
            <p>ElMinya, Egypt</p>
          </div>
        </div>
        {/* Review Items */}
        <div className="payment-section">
          <div className="payment-title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment-items">
            {basket.map((item) => (
              <CheckoutProduct
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        {/* Payment method */}
        <div className="payment-section">
          <h3>Payment Method</h3>
          <div className="payment-details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payment-priceContainer">
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total : {value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button type="submit" disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// import { React, useEffect, useState } from "react";
// import CurrencyFormat from "react-currency-format";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/GlobalState";
// import CheckoutProduct from "./CheckoutProduct";
// import axios from "./axios";
// import "./Payment.css";
// import { getBasketTotal } from "../context/AppReducer";

// const Payment = () => {
//   const { basket, user, dispatch } = useAuth();
//   const [clientSecret, setClientSecret] = useState();
//   const [error, setError] = useState(null);
//   const [disabled, setDisabled] = useState(true);
//   const [succeeded, setSucceeded] = useState(false);
//   const [processing, setProcessing] = useState("");
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getClientSecret = async () => {
//       const response = await axios({
//         method: "post",
//         url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
//       });
//       setClientSecret(response.data.clientSecret);
//       return response;
//     };
//     getClientSecret();
//   }, [basket]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setProcessing(true);
//     const payload = await stripe
//       .confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//         },
//       })
//       .then(({ paymentIntent }) => {
//         setSucceeded(true);
//         setError(null);
//         setProcessing(false);
//         dispatch({
//           type: "EMPTY_BASKET",
//         });
//         navigate("/orders", { replace: true });
//       });
//   };
//   const handleChange = (e) => {
//     setDisabled(e.empty);
//     setError(error ? error.message : "");
//   };
//   return (
//     <div className="payment">
//       <div className="payment-container">
//         <h1>
//           Checkout (<Link to="/checkout">{basket.length} items</Link>)
//         </h1>
//         {/* Delivery Address */}
//         <div className="payment-section">
//           <div className="payment-title">
//             <h3>Delivery Address</h3>
//           </div>
//           <div className="payment-address">
//             <p>{user?.email}</p>
//             <p>Alexandria, Egypt</p>
//           </div>
//         </div>
//         {/* Review Items*/}
//         <div className="payment-section">
//           <div className="payment-title">
//             <h3>Review items and delivery</h3>
//           </div>
//           <div className="payment-items">
//             {basket.map((item) => (
//               <CheckoutProduct
//                 key={item.id}
//                 id={item.id}
//                 title={item.title}
//                 image={item.image}
//                 price={item.price}
//                 rating={item.rating}
//               />
//             ))}
//           </div>
//         </div>
//         {/* Payment method*/}
//         <div className="payment-section">
//           <h3>Payment Method</h3>
//           <div className="payment-details">
//             <form onSubmit={handleSubmit}>
//               <CardElement onChange={handleChange} />
//               <div className="payment-priceContainer">
//                 <CurrencyFormat
//                   renderText={(value) => <h3>Order Total : {value}</h3>}
//                   decimalScale={2}
//                   value={getBasketTotal(basket)}
//                   displayType={"text"}
//                   thousandSeparator={true}
//                   prefix={"$"}
//                 />
//                 <button
//                   type="submit"
//                   disabled={processing || disabled || succeeded}
//                 >
//                   <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
//                 </button>
//               </div>
//               {error && <div>{error}</div>}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;