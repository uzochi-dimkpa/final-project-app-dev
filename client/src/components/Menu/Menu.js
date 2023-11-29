import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SessionContext } from '../../contexts/SessionContext.js';

import '../../index.scss';

function Menu() {
  const { loggedIn, setLoggedIn, setUsername } = useContext(SessionContext);
  
  // Navigate
  const navigate = useNavigate();

  // Logout
  const logout = () => {
    console.log('Logout!');
    window.localStorage.setItem('loggedIn', false);
    window.localStorage.setItem('username', '');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('expiresIn');
    setLoggedIn(false);
    setUsername('');
    navigate('/');
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

  // Scroll to settings section
  const scrollToSettings = () => {
    setTimeout(
      () => {
        document.getElementById('settings-page-section').scrollIntoView({
          behavior: 'smooth'
        });
      },
      150
    );
  }

  // Scroll to contact section
  const scrollToContact = () => {
    setTimeout(
      () => {
        document.getElementById('contact-page-section').scrollIntoView({
          behavior: 'smooth'
        });
      },
      150
    );
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

          {/* <!-- This is an SEO Change --> */}
          <li><Link to="https://www.youtube.com/watch?v=EsOTfVIcdEI" rel="nofollow noopener noreferrer">Learn More</Link></li>
          {/* <img src={yt_logo} onClick={() => {window.location.href = 'https://www.youtube.com/watch?v=EsOTfVIcdEI'}} rel="nofollow noopener noreferrer" alt="Personal finance 101 lesson" style={{width: "40px", height: "40px"}}/> */}
          
          {loggedIn &&
          <li><Link to="/contact" onClick={scrollToContact}>Contact</Link></li>}

          {loggedIn &&
          <li><Link to="/settings" onClick={scrollToSettings}>Settings</Link></li>}
          
          {!loggedIn ?
          <li><Link to="/login">Login</Link></li>
          : <li><Link to="/" onClick={logout}>Logout</Link></li>}

          {!loggedIn ?
          <li><Link to="/signup">Signup</Link></li>
          : null}

        </ul>
      </div>
      </>
  );
}

export default Menu;
