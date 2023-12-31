import axios from "axios";
import React, { useContext, useEffect } from "react";
import { SessionContext } from "../../contexts/SessionContext.js";

function IdleTimer() {
  // console.log('IdleTimer!');
  
  const { loggedIn, setLoggedIn, username, setUsername } = useContext(SessionContext);
	const token = window.localStorage.getItem('token');
  const expiresIn = window.localStorage.getItem('expiresIn');
  const currentPathName = window.location.pathname;

  let popupTimeout, logoutTimeout;

  // Pages to not run the idle timer on
  // const whitelist = [
  //   '/',
  //   '/about',
  //   '/contact'
  // ]

  // Refresh token
  const tokenRefresh = () => {
    (username && loggedIn && token) &&
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/refresh-token`, {username}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      // console.log(res.data);
      console.log('Token refreshed...');
      window.localStorage.setItem('token', res.data.token);
      window.localStorage.setItem('expiresIn', res.data.expiresIn);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // Hide Popup
	const hidePopup = () => {
    document.getElementById('token-popup').style.display = 'none';
    // if (document.getElementById('delete-account-popup').style.display === 'none') {
    document.getElementById('popup-overlay').style.display = 'none';
    // }
    clearTimeout(popupTimeout);
    clearTimeout(logoutTimeout);
    window.removeEventListener('mousemove', onMouseMove);
    tokenRefresh();
    
    // window.location.reload();
	}

  // Logout
  const logout = () => {
    console.log('Logout!');
    window.localStorage.setItem('loggedIn', false);
    window.localStorage.setItem('username', '');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('expiresIn');
    setLoggedIn(false);
    setUsername('');
    document.getElementById('token-popup').style.display = 'none';
		// if (document.getElementById('delete-account-popup').style.display === 'none') {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('popup-overlay-2').style.display = 'none';
    // }
    window.location.href = '/';
    hidePopup();
    clearTimeout(popupTimeout);
    clearTimeout(logoutTimeout);
    window.removeEventListener('mousemove', onMouseMove);
  }

  // Restart timer
  const restartAutoReset = () => {
    (loggedIn && token && popupTimeout) &&
    clearTimeout(popupTimeout);

    (loggedIn && token && logoutTimeout) &&
    clearTimeout(logoutTimeout);

    if (loggedIn && token) {
      popupTimeout = setTimeout(() => {
        document.getElementById('popup-overlay').style.display = 'block';
        document.getElementById('token-popup').style.display = 'block';
      }, Number(expiresIn) - 20000);

      logoutTimeout = setTimeout(() => {
        logout();
      }, expiresIn);
    }
  }

  // On mouse move
  const onMouseMove = () => {
    // console.log('Mouse has moved!');
    // console.log(document.getElementById('delete-account-popup').style.display);
    restartAutoReset();
  }

  // Extra useEffect
  // useEffect(() => {
  //   // ...
  // }, [currentPathName]);

  // Call function every time page changes
  useEffect(() => {
    // let preventReset = false;

    // Prevent whitelist pages from executing
    // for (const pathName of whitelist) {
    //   if (pathName === currentPathName) {
    //     preventReset = true;
    //   }
    // }

    // if (preventReset) {
    //   return;
    // }

    // Initiate timeout
    restartAutoReset();

    // Listen for mouse movement
    window.addEventListener('mousemove', onMouseMove);

    // Cleanup
    return () => {
      if (popupTimeout) {
        clearTimeout(popupTimeout);
        window.removeEventListener('mousemove', onMouseMove);
      }

      if (logoutTimeout) {
        clearTimeout(logoutTimeout);
        window.removeEventListener('mousemove', onMouseMove);
      }

      // (!loggedIn && !username) &&
      // window.localStorage.removeItem('token');

      // (!loggedIn && !username) &&
      // window.localStorage.removeItem('expiresIn');
    };
  }, [currentPathName]);
  
  return (
    <>
      <div data-testid="token-popup" id='token-popup' className='center token-popup' style={{"display": "none"}}>
        <h1>WARNING!</h1>
        <h2>Your session is about to expire. Would you like to refresh your session?</h2>
        <button onClick={hidePopup} className='popup-button button'>Yes</button>
        <button onClick={logout} className='popup-button button' style={{"marginLeft": "40px"}}>No</button>
      </div>
    </>
  )
}


export default IdleTimer;