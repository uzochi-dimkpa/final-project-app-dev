import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SessionContext } from '../../contexts/SessionContext.js';

import '../../App.scss';
import '../../index.scss';

function BreadCrumbs() {
  // console.log('BreadCrumbs!');

  const { loggedIn, setLoggedIn, setUsername } = useContext(SessionContext);

  // Logout
  const logout = () => {
    console.log('Logout!');
    window.localStorage.setItem('loggedIn', false);
    window.localStorage.setItem('username', '');
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expiresIn");
    setLoggedIn(false);
    setUsername('');
    document.getElementById('token-popup').style.display = 'none';
    // scrollToBreadCrumbs();
    // window.location.reload();
    window.location.href = '/';
  }

  // Scroll to breadcrumbs menu
  // const scrollToBreadCrumbs = () => {
  //   setTimeout(
  //     () => {
  //       document.getElementById('breadcrumbs-menu').scrollIntoView({
  //         behavior: 'smooth'
  //       })
  //     },
  //     150
  //   )
  // }

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

  // Scroll to view budget data
  const scrollToViewBudget = () => {
    setTimeout(
      () => {
        document.getElementById('view-budget-data').scrollIntoView({
          behavior: 'smooth'
        })
      },
      150
    )
  }

  // Scroll to change data fields section
  const scrollToFields = () => {
    setTimeout(
      () => {
        document.getElementById('enter-data-fields').scrollIntoView({
          behavior: 'smooth'
        });
      },
      150
    );
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
    //   BreadCrumbs
    // </div>
    <>
      <div id='breadcrumbs-menu'/>
      <div className="center menu sticky-breadcrumbs-menu">
        <ul>
          <li id='view_budget_breadcrumbs'><Link to="" onClick={scrollToViewBudget}>View Budget</Link></li>

          {loggedIn &&
          <li id='enter_data_breadcrumbs'><Link to=""  onClick={scrollToFields}>Enter Data</Link></li>}
          
          <li id='about_page_breadcrumbs'><Link to="/about" onClick={scrollToViewAboutPage}>About</Link></li>

          {/* <!-- This is an SEO Change --> */}
          <li id='learn_more_breadcrumbs'><Link to="https://www.youtube.com/watch?v=EsOTfVIcdEI" rel="nofollow noopener noreferrer">Learn More</Link></li>
          {/* <img src={yt_logo} onClick={() => {window.location.href = 'https://www.youtube.com/watch?v=EsOTfVIcdEI'}} rel="nofollow noopener noreferrer" alt="Personal finance 101 lesson" style={{width: "40px", height: "40px"}}/> */}
          
          {loggedIn &&
          <li><Link to="/contact" onClick={scrollToContact}>Contact</Link></li>}

          {loggedIn &&
          <li id='settings_page_breadcrumbs'><Link to="/settings" onClick={scrollToSettings}>Settings</Link></li>}
          
          {!loggedIn ?
          <li><Link to="/login">Login</Link></li>
          : <li id="logout_breadcrumbs"><Link to="/" onClick={logout}>Logout</Link></li>}

          {!loggedIn ?
          <li id='signup_breadcrumbs'><Link to="/signup">Signup</Link></li>
          : null}

        </ul>
      </div>
      <div id='view-budget-data'/> <div id='view-about-page'/>
    </>
  );
}

export default BreadCrumbs;
