import { useState } from 'react';
import IdleTimer from '../components/IdleTimer/IdleTimer';
import { SessionContext } from '../contexts/SessionContext';
import { BudgetDisplayContext } from '../contexts/BudgetDisplayContext';
import App from '../App';


function SessionHook() {
  // console.log('SessionHook is a parent to App!')

  const token = window.localStorage.getItem("token");
  
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
  // (window.localStorage.setItem('expiresIn') === null) && window.localStorage.setItem('expiresIn', )


  // Budget Display Context
  const [hasBudget, setHasBudget] = useState(false);
  const [database, setDatabase] = useState(
		(loggedIn && token && username !== '') ?
		'personal-budget' : 'guest-budget'
	);

  return (
    <SessionContext.Provider value={{loggedIn, setLoggedIn, username, setUsername, expiresIn, setExpiresIn}}>
      <BudgetDisplayContext.Provider value={{hasBudget, setHasBudget, database, setDatabase}}>
        <IdleTimer/>
        <App/>
      </BudgetDisplayContext.Provider>
    </SessionContext.Provider>
  )
}

export default SessionHook;