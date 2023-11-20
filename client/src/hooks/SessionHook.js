import { useState } from 'react';
import { SessionContext } from '../contexts/SessionContext';
import { BudgetDisplayContext } from '../contexts/BudgetDisplayContext';
import App from '../App';


function SessionHook() {
  // console.log('SessionHook is a parent to App!')
  
  // Session Context
  const [loggedIn, setLoggedIn] = useState(
    window.localStorage.getItem('loggedIn') === 'true' ?
    true : false
  );
  const [username, setUsername] = useState(
    window.localStorage.getItem('username') !== null ?
    window.localStorage.getItem('username') : ''
  );

  if (!window.localStorage.getItem('loggedIn')) window.localStorage.setItem('loggedIn', false);
  if (window.localStorage.getItem('username') === null) window.localStorage.setItem('username', '');


  // Budget Display Context
  const [hasBudget, setHasBudget] = useState(false);
  const [database, setDatabase] = useState(
		(loggedIn && username !== '') ?
		'personal-budget' : 'guest-budget'
	);

  return (
    <SessionContext.Provider value={{loggedIn, setLoggedIn, username, setUsername}}>
      <BudgetDisplayContext.Provider value={{hasBudget, setHasBudget, database, setDatabase}}>
        <App/>
      </BudgetDisplayContext.Provider>
    </SessionContext.Provider>
  )
}

export default SessionHook;