import { useState } from 'react';
import IdleTimer from '../components/IdleTimer/IdleTimer.js';
import { SessionContext } from '../contexts/SessionContext.js';
import { BudgetDisplayContext } from '../contexts/BudgetDisplayContext.js';
import App from '../App.js';


function SessionHook() {
  // console.log('SessionHook is a parent to App!')

  const token = window.localStorage.getItem('token');
  
  // Session Context
  const [loggedIn, setLoggedIn] = useState(
    window.localStorage.getItem('loggedIn') === 'true' ?
    true : false
  );
  const [username, setUsername] = useState(
    window.localStorage.getItem('username') !== null ?
    window.localStorage.getItem('username') : ''
  );

  const [expiresIn, setExpiresIn] = useState(
    window.localStorage.getItem('expiresIn') !== null ?
    window.localStorage.getItem('expiresIn') : 0
  );

  (!window.localStorage.getItem('loggedIn')) && window.localStorage.setItem('loggedIn', false);
  (window.localStorage.getItem('username') === null) && window.localStorage.setItem('username', '');


  // Budget Display Context
  const [hasBudget, setHasBudget] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [database, setDatabase] = useState(
		(loggedIn && token && username !== '') ?
		'personal-budget' : 'guest-budget'
	);

  return (
    <SessionContext.Provider value={{loggedIn, setLoggedIn, username, setUsername, expiresIn, setExpiresIn}}>
      <BudgetDisplayContext.Provider value={{hasBudget, setHasBudget, hasAccount, setHasAccount, database, setDatabase}}>
        <div id="popup-overlay"/>
        <div id="popup-overlay-2"/>
        <IdleTimer/>
        <App/>
      </BudgetDisplayContext.Provider>
    </SessionContext.Provider>
  )
}

export default SessionHook;