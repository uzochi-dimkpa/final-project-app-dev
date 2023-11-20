import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SessionContext } from '../../contexts/SessionContext';

import '../../index.scss';

function Menu() {
  const { loggedIn, setLoggedIn, setUsername } = useContext(SessionContext);
	const token = window.localStorage.getItem("token");

  // Navigate
  const navigate = useNavigate();

  // Token verification
  useEffect(() => {
    (loggedIn && token) &&
    setTimeout(
      () => {
        document.getElementById('token-popup').style.display = 'block';
      },
      40000
    );
  }, [loggedIn, token]);

  let logoutTimeout
  
  if (loggedIn && token) {
    logoutTimeout = setTimeout(
      () => {
        document.getElementById('token-popup').style.display = 'block';
        logout();
      },
      60000
    );
  }

  // Hide Popup
	const hidePopup = () => {
		document.getElementById('token-popup').style.display = 'none';
    window.location.reload();
	}

  // const hidePopupLogout = () => {
  //   hidePopup();
  //   clearTimeout(logoutTimeout);
  // }

	// Logout
  const logout = () => {
    console.log('Logout!');
    window.localStorage.setItem('loggedIn', false);
    window.localStorage.setItem('username', '');
    window.localStorage.removeItem("token");
    setLoggedIn(false);
    setUsername('');
    navigate('/');
    hidePopup();
    clearTimeout(logoutTimeout);
  }

  // Scroll to view About page section 
  const scrollToViewAboutPage = () => {
    setTimeout(
      () => {
        document.getElementById('view-about-page').scrollIntoView({
          behavior: 'smooth'
        })
      },
      150
    )
  }
  
  return (
    // <div>
    //   Menu
    // </div>
    <>
      <div className="center menu">
        <ul>
          <li><Link to="/">Homepage</Link></li>

          <li><Link to="/about" onClick={scrollToViewAboutPage}>About</Link></li>

          {!loggedIn ?
          <li><Link to="/login">Login</Link></li>
          : <li><Link to="/" onClick={logout}>Logout</Link></li>}

          {!loggedIn ?
          <li><Link to="/signup">Signup</Link></li>
          : null}

          {/* <!-- This is an SEO Change --> */}
          <li><Link to="https://www.youtube.com/watch?v=EsOTfVIcdEI" rel="nofollow noopener noreferrer">Learn More</Link></li>
          {/* <img src={yt_logo} onClick={() => {window.location.href = 'https://www.youtube.com/watch?v=EsOTfVIcdEI'}} rel="nofollow noopener noreferrer" alt="Personal finance 101 lesson" style={{width: "40px", height: "40px"}}/> */}

          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
      <div id='token-popup' className='center token-popup' style={{"display": "none"}}>
				<h1 style={{"color": "black"}}>WARNING!</h1>
				<h2 style={{"color": "black"}}>Your session is about to expire. Would you like to refresh your session?</h2>
				<button onClick={hidePopup} className='token-button button'>Yes</button>
				<button onClick={logout} className='token-button button' style={{"marginLeft": "40px"}}>No</button>
			</div>
      </>
  );
}

export default Menu;
