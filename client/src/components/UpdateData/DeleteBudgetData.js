import axios from "axios";
import React, { useContext, useState } from 'react';
import { SessionContext } from "../../contexts/SessionContext.js";
import { BudgetDisplayContext } from "../../contexts/BudgetDisplayContext.js";


function DeleteBudgetData() {
  const { username } = useContext(SessionContext);
  const { database } = useContext(BudgetDisplayContext);
  const { hasBudget, setHasBudget } = useContext(BudgetDisplayContext);
  const token = window.localStorage.getItem("token");

  const [budgetCategory, setBudgetCategory] = useState({
    category: "",
    username: username,
    database: database
  });

  // Handle input data changes
  const handleChange = (e) => {
    const value = e.target.value;
    setBudgetCategory({ 
      ...budgetCategory,
      [e.target.name]: value
    });

    console.log(e.target.name, e.target.value);
  }

  // Grab budget category data
  // axios.post('http://localhost:3010/list-data', {username, database}, {
  //   headers: {
  //     'Authorization': `Bearer ${token}`,
  //   }
  // })
  // .then((res) => {
  //   // console.log(res.data[0]);
  //   setBudgetCategories(res.data);
  //   res.data.forEach(element => {
  //     // console.log(element);
  //     document.getElementById('delete-budget-data').innerHTML += `<h1>${element.category}</h1>`;
  //     // return res.data.map((element, index) => {
  //     //   <div className="delete-data-element" key={index}>
  //     //     {element}, {index}
  //     //   </div>
  //     // })
  //   });
  // })
  // .catch((err) => {
  //   console.log(err);
  // });

  const badDeleteBudget = () => {
    alert(`WARNING! Missing ${username}'s category to delete:\n\n${!budgetCategory.category ? 'Category' : ''}`);
  }

  const deleteBudget = () => {
    axios.post('http://localhost:3010/delete-budget', budgetCategory, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((res) => {
      (!res.data) && alert('Failed to delete your budget category\n\nPlease re-enter the category\nname and try again');
      (res.data && !hasBudget) && setHasBudget(true);
      (res.data) && window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // Allow 'Enter' key press
  const handleEnterPress = (e) => {
    if(e.key === 'Enter') {
      (budgetCategory.category) ? deleteBudget() : badDeleteBudget();
    }
  }

  return (
    <>
      {/* <h2>DeleteBudgetData</h2> */}
      <div className="App container center">
        <div id="delete-budget-data"/>
        <h1><strong>Delete your budget data!</strong></h1>
        <p>Hint: <strong>You can remove a budget category of your choice by typing in its name and selecting 'Delete' below</strong></p>
        <br/>
        <label>
          <h2>Category to Delete</h2>
          <input alt='budget category' className='add-data' autoComplete='off' onChange={handleChange} onKeyUp={handleEnterPress} name="category" type='text' placeholder='Enter budget category to delete here...' required/>
        </label>
        <br/><br/><br/><br/>
        <button className='delete-data-button button' type='submit' onClick={(budgetCategory.category) ? deleteBudget : badDeleteBudget}>Delete</button>
      </div>
    </>
  )
}


export default DeleteBudgetData;