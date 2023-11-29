import axios from 'axios';
import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../contexts/SessionContext.js';


function SignupPage(props) {
  // Uer info state
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: ""
  });

  // Bad signup attempt
  const badSignup = (e) => {
    alert(`WARNING!\nMissing signup information:\n\n${!userInfo.username ? 'Username' : ''}\n${!userInfo.password ? 'Password' : ''}`)
  }
  
  // Handle input data gathering
  const handleChange = (e) => {
    const value = e.target.value;
    setUserInfo({
      ...userInfo,
      [e.target.name]: value
    });
  };

  // Navigate
  const navigate = useNavigate();

  // Session context
  const { setLoggedIn, setUsername } = useContext(SessionContext);

  // Login
  const login = () => {
    console.log('Login!');
  }

  // Signup
  const signup = () => {
    console.log('Signup!');

    axios.post('http://localhost:3010/signup', userInfo)
    .then((res) => {
      // console.log(res);

      (res.data.result && res.data.result !== 'USER_ALREADY_EXISTS') ? navigate('/') :
        (res.data.result === 'USER_ALREADY_EXISTS') ? alert('This user already exists! Pleas try again with a different username') :
        alert('Bad signup attempt. Please try again...');
      
      if (res.data.result === true && res.data.token) {
        window.localStorage.setItem("loggedIn", res.data.result);
        window.localStorage.setItem("username", userInfo.username);
        window.localStorage.setItem("token", res.data.token);
        window.localStorage.setItem('expiresIn', res.data.expiresIn);
        setLoggedIn(res.data.result);
        setUsername(userInfo.username);
        window.location.reload();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // Allow 'Enter' key press
  const handleEnterPress = (e) => {
    if(e.key === 'Enter') {
      (userInfo.username && userInfo.password) ? signup() : badSignup();
    }
  }

  // Accessibility scroll
  const signupRef = useRef(null);
  const scrollToSignup = () => {
    setTimeout(
      () => {
        (signupRef.current) &&
        signupRef.current.scrollIntoView({
          behavior: 'smooth'
        });
      },
      150
    );
  }
  
  (window.location.href.includes('/signup')) &&
  scrollToSignup();
  

  return(
    // <div>
    //   Signup!
    // </div>
    <div className='App'>
      {/* In-page navigation scroll */}
      <div ref={signupRef}/>
      <h1>SIGNUP</h1>
      <h2>Please sign up for an account below to begin budgeting...</h2>
      <br/>
      <label>
        <h2>Username:</h2>
        <input alt='login username' className='icon login_signup un' onChange={handleChange} autoComplete='off' name='username' type='text' placeholder='Enter your username here...' autoFocus required/>
      </label>
      <br/><br/>
      <label>
        <h2>Password:</h2>
        <input alt='login password' className='icon login_signup pw'  onKeyUp={handleEnterPress} onChange={handleChange} autoComplete='off' name='password' type='password' placeholder='Enter your password here...' required/>
      </label>
      <br/><br/><br/>
      <button className='signup-button button' type='submit' onClick={(userInfo.username && userInfo.password) ? signup : badSignup}>Create account</button>
      <br/><br/><br/>
      <h3>Already have an account with us? <a href='/login' onClick={login}>Login here!</a></h3>
    </div>
  )
}

export default SignupPage;