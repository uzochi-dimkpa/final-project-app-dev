import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SessionContext } from '../../contexts/SessionContext';

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
    setLoggedIn(false);
    setUsername('');
    document.getElementById('token-popup').style.display = 'none';
    // scrollToBreadCrumbs();
    window.location.reload();
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

  // Scroll to add budget data section
  const scrollToAdd = () => {
    setTimeout(
      () => {
        document.getElementById('add-budget-data').scrollIntoView({
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
          <li><Link to="" onClick={scrollToViewBudget}>View Budget</Link></li>

          {loggedIn &&
          <li><Link to=""  onClick={scrollToAdd}>Add Data</Link></li>}
          
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
      <div id='view-budget-data'/> <div id='view-about-page'/>
    </>
  );
}

export default BreadCrumbs;
