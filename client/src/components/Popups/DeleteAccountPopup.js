import axios from "axios";
import React, { useContext } from "react";
import { SessionContext } from "../../contexts/SessionContext.js";
import { BudgetDisplayContext } from "../../contexts/BudgetDisplayContext.js";

function DeleteAccountPopup() {
  // console.log('IdleTimer!');
  
  const { setLoggedIn, username, setUsername } = useContext(SessionContext);
  const { database } = useContext(BudgetDisplayContext);
	const token = window.localStorage.getItem('token');

  // Hide Popup
	const hidePopup = () => {
    document.getElementById('popup-overlay-2').style.display = 'none';
		document.getElementById('delete-account-popup').style.display = 'none';
	}

  // Logout
  const deleteAccount = () => {
    console.log('Logout!');
    window.localStorage.setItem('loggedIn', false);
    window.localStorage.setItem('username', '');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('expiresIn');
    setLoggedIn(false);
    setUsername('');
    window.location.href = '/';
    hidePopup();

    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('popup-overlay-2').style.display = 'none';
		document.getElementById('delete-account-popup').style.display = 'none';
		// document.getElementById('token-popup').style.display = 'none';

    // Delete account
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/delete-account`,
    {
      username: username,
      database: database
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((res) => {
      // (res.data) && console.log(res.data);
      // (res.data && !hasBudget) && setHasBudget(true);
      if (res.data) window.location.href = '/';
    })
    .catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
      <div data-testid="delete-account-popup" id='delete-account-popup' className='delete-account-popup center' style={{"display": "none"}}>
        <h1>DANGER!</h1>
        <h2>You are about to permanently delete your account. This action cannot be undone. Are you sure you want to do this?</h2>
        <button id="popup_delete_account_yes" onClick={deleteAccount} className='popup-button button'>Yes</button>
        <button id="popup_delete_account_no" onClick={hidePopup} className='popup-button button' style={{"marginLeft": "40px"}}>No</button>
      </div>
    </>
  )
}


export default DeleteAccountPopup;