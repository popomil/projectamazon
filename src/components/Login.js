
import Logo from "../images//login-logo.png";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
 import {createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth"
 import { useState } from "react";
 import {auth} from "../firebase"
 import { useAuth } from "../context/GlobalState";


const Login = () => {
  console.log(auth)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
const register = (e) =>{
  e.preventDefault()
  createUserWithEmailAndPassword(auth,email,password).then((auth) => {
    if(auth){
      navigate("/")
    }
  }).catch((error) => {
    alert(error.message)
  })
}
const signIn = (e) => {
  e.preventDefault()
  signInWithEmailAndPassword(auth,email,password).then((auth) =>{
    if(auth){
      navigate("/")
    }
  }).catch((error) => {
    alert(error.message)
  })
}

  return (
    <div className="login">
      <Link to="/">
        <img className="login-logo" src={Logo} alt="logo-img" />
      </Link>
      <div className="login-container">
        <h1>Sign in</h1>
        <form>
          <h5>Email</h5>
          <input
            type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
            />
          <h5>Password</h5>
          <input
            type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
            />
          <button onClick={signIn} className="login-signInBtn" type="submit">
            Sign in
          </button>
          <p>
            By continuing, you agree to Amazon's Fake Clone Conditions of Use
            and Privacy Notice.
          </p>
          <button onClick={register} className="login-registerBtn">
            Create your Amazon Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
