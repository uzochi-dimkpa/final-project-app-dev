import axios from "axios";
import React, { useContext, useState } from 'react';
import { SessionContext } from "../../contexts/SessionContext.js";
import { BudgetDisplayContext } from "../../contexts/BudgetDisplayContext.js";


function AddBudgetData() {
  const { username } = useContext(SessionContext);
  const { hasBudget, setHasBudget, database } = useContext(BudgetDisplayContext);
  const token = window.localStorage.getItem("token");

  const [budgetData, setBudgetData] = useState({
    amount: "",
    category: "",
    color: "#000000",
    username: username,
    database: database
  });

  // Handle input data changes
  const handleChange = (e) => {
    const value = e.target.value;
    setBudgetData({ 
      ...budgetData,
      [e.target.name]: value
    });

    // console.log(budgetData.amount, budgetData.category, budgetData.color);
  }

  // Handle bad input
  const badAdd = () => {
    alert(`WARNING! Missing ${username}'s new budget data:\n\n${!budgetData.amount ? 'Amount' : ''}\n${!budgetData.category ? 'Category' : ''}\n${!budgetData.color ? 'Color' : ''}`);
  }

  // Add budget data to user's account
  const add = () => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/add-budget`, budgetData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => {
      // (res.data) && console.log(res.data);
      (res.data && !hasBudget) && setHasBudget(true);
      (res.data) && window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  return (
    // <>
    //   AddBudgetData
    // </>
    <>
      <div className="App container center">
        <div id='add-budget-data'/>
        <h1><strong>Add some {hasBudget && 'more'} data!</strong></h1>
        <p>Hint: <strong>You can also use these fields to update your budget information!</strong></p>
        <br/>
        <>
          <label>
            <h2>Category</h2>
            <input alt='budget category' className='add-data' autoComplete='off' onChange={handleChange} name="category" type='text' placeholder='Enter your budget category here...' required/>
          </label>
          <label>
            <h2>Amount</h2>
            <input alt='category amount' className='add-data' autoComplete='off' onChange={handleChange} name="amount" type='number' placeholder='Enter your category amount here...' required/>
          </label>
          <label>
            <h2>Color</h2>
            <input alt='category color' className='add-data' autoComplete='off' onChange={handleChange} name="color" type='color' placeholder='Select your preferred color here...' required/>
          </label>
        </>
        <br/><br/><br/><br/>
        <button className='add-data-button button' type='submit' onClick={(budgetData.amount && budgetData.category && budgetData.color) ? add : badAdd}>Add</button>
      </div>
    </>
  )
}


export default AddBudgetData;