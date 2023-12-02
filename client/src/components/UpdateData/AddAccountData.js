import axios from "axios";
import React, { useContext, useState } from 'react';
import { SessionContext } from "../../contexts/SessionContext.js";
import { BudgetDisplayContext } from "../../contexts/BudgetDisplayContext.js";


function AddAccountData() {
  const { username } = useContext(SessionContext);
  const { hasBudget, setHasBudget, database } = useContext(BudgetDisplayContext);
  const token = window.localStorage.getItem("token");

  const [accountData, setAccountData] = useState({
    monthly_income: undefined,
    monthly_expense: undefined,
    username: username,
    database: database
  });

  // Handle input data changes
  const handleChange = (e) => {
    const value = e.target.value;
    setAccountData({ 
      ...accountData,
      [e.target.name]: value
    });
  }

  // Handle bad input
  const badAdd = () => {
    alert(`WARNING! Missing ${username}'s new monthly account data:\n\n${!accountData.monthly_income ? 'Monthly Income' : ''}\n${!accountData.monthly_expense ? 'Monthly Expense' : ''}`);
  }

  // Add budget data to user's account
  const add = () => {
    if (accountData.monthly_income === '') accountData.monthly_income = undefined;
    if (accountData.monthly_expense === '') accountData.monthly_expense = undefined;
    
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/add-account`, accountData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => {
      // (res.data) && console.log(res.data);
      (res.data && !hasBudget) && setHasBudget(true);
      (res.data) && window.location.reload();
      // if (res.data) window.location.href = '/';
    })
    .catch((err) => {
      console.log(err);
    });
  }

  return (
    // <>
    //   AddAccountData
    // </>
    <div className="App center">
      <div id='enter-account-data'/>
      <h1><strong>Enter your monthly account data!</strong></h1>
      <p>Hint: <strong>You can also use these fields to update your account information!</strong></p>
      <br/>
      <>
        <label>
          <h2>Monthly Income</h2>
          <input alt='monthly income' className='add-data' autoComplete='off' onChange={handleChange} name="monthly_income" type='number' placeholder='Enter your monthly income here...'/>
        </label>
        <label>
          <h2>Monthly Expense</h2>
          <input alt='monthly expense' className='add-data' autoComplete='off' onChange={handleChange} name="monthly_expense" type='number' placeholder='Enter your monthly expense here...'/>
        </label>
      </>
      <br/><br/><br/><br/>
      <button className='enter-account-button button' type='submit' onClick={(accountData.monthly_income || accountData.monthly_expense) ? add : badAdd}>Enter</button>
    </div>
  )
}


export default AddAccountData;