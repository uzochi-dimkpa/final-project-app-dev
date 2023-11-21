import React, { useContext, useEffect, useRef } from "react";
// import App from "../../App";
import { SessionContext } from "../../contexts/SessionContext";

function IdleTimer() {
  // console.log('IdleTimer!');
  
  const { loggedIn, setLoggedIn, setUsername } = useContext(SessionContext);
  const timeRef = useRef(null);

	const token = window.localStorage.getItem("token");
  const expiresIn = window.localStorage.getItem("expiresIn");
  
  const currentPathName = window.location.pathname;

  let popupTimeout, logoutTimeout;

  // Pages to not run the idle timer on
  const whitelist = [
    '/',
    '/about',
    '/contact'
  ]

  // Restart timer
  const restartAutoReset = () => {
    (loggedIn && token && popupTimeout) &&
    clearTimeout(popupTimeout);

    (loggedIn && token && logoutTimeout) &&
    clearTimeout(logoutTimeout);

    if (loggedIn && token) {
      popupTimeout = setTimeout(() => {
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
    restartAutoReset();
  }

  // Hide Popup
	const hidePopup = () => {
		document.getElementById('token-popup').style.display = 'none';
    clearTimeout(popupTimeout);
    clearTimeout(logoutTimeout);
    window.removeEventListener('mousemove', onMouseMove);
    // window.location.reload();
	}

  // Logout
  const logout = () => {
    console.log('Logout!');
    window.localStorage.setItem('loggedIn', false);
    window.localStorage.setItem('username', '');
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expiresIn");
    setLoggedIn(false);
    setUsername('');
    hidePopup();
    clearTimeout(popupTimeout);
    clearTimeout(logoutTimeout);
    window.removeEventListener('mousemove', onMouseMove);
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
    };
  }, [currentPathName]);
  
  return (
    <>
      <div ref={timeRef} id='token-popup' className='center token-popup' style={{"display": "none"}}>
        <h1>WARNING!</h1>
        <h2>Your session is about to expire. Would you like to refresh your session?</h2>
        <button onClick={hidePopup} className='token-button button'>Yes</button>
        <button onClick={logout} className='token-button button' style={{"marginLeft": "40px"}}>No</button>
      </div>
    </>
  )
}


export default IdleTimer;