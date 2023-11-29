import axios from 'axios';
import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../contexts/SessionContext.js';


function LoginPage() {
  // User info state
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: ""
  });

  // Bad login attempt
  const badLogin = (e) => {
    alert(`WARNING! Missing login information:\n\n${!userInfo.username ? 'Username' : ''}\n${!userInfo.password ? 'Password' : ''}`)
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

  // Signup
  const signup = () => {
    console.log('Signup!');
  }

  // Login
  const login = () => {
    console.log('Login!');
    
    axios.post('http://localhost:3010/login', userInfo)
    .then((res) => {
      // console.log(res);

      (res.data.result === true && res.data.result !== 'BAD_USERNAME') ? navigate('/') :
        (res.data.result === 'BAD_USERNAME') ? alert('This user does not exist! Pleas try again with a different username') :
        alert('Incorrect password! Please try again');
      
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
  };
  
  // Allow 'Enter' key press
  const handleEnterPress = (e) => {
    if(e.key === 'Enter') {
      (userInfo.username && userInfo.password) ? login() : badLogin();
    }
  }

  // Accessibility scroll
  const loginRef = useRef(null);
  const scrollToLogin = () => {
    setTimeout(
      () => {
        (loginRef.current) &&
        loginRef.current.scrollIntoView({
          behavior: 'smooth'
        });
      },
      150
    );
  }
  
  (window.location.href.includes('/login')) &&
  scrollToLogin();
  
  return (
    // <div>
    //   LoginPage
    // </div>
    <div className='App'>
      {/* In-page navigation scroll */}
      <div ref={loginRef}/>
      <h1>LOGIN</h1>
      <h2>Please login below to see your budget details...</h2>
      <br/>
      <label>
        <h2>Username:</h2>
        <input alt='login username' className='icon login_signup un' onKeyUp={handleEnterPress} onChange={handleChange} autoComplete='off' name='username' type='text' placeholder='Enter your username here...' autoFocus required/>
      </label>
      <br/><br/>
      <label>
        <h2>Password:</h2>
        <input alt='login password' className='icon login_signup pw' onKeyUp={handleEnterPress} onChange={handleChange} autoComplete='off' name='password' type='password' placeholder='Enter your password here...' required/>
        {/* <img src={require('../../images/show.png')} style={{'height': '24px', 'marginLeft': '-30px'}} alt='display password'/> */}
      </label>
      <br/><br/><br/>
      <button className='login-button button' type='submit' onClick={(userInfo.username && userInfo.password) ? login : badLogin}>Login</button>
      {/* <button className='login-button button' onClick={LoginHook(userInfo)}>BUTTON</button> */}
      <br/><br/><br/>
      <h3>Don't have an account with us? <a href='/signup' onClick={signup}>Sign up here!</a></h3>
    </div>
  );
}

export default LoginPage;
