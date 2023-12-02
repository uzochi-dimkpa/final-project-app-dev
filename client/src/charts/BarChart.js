import axios from 'axios';
import React, { useContext } from 'react';
import { Chart as ChartJS } from 'chart.js';
import 'chart.js/auto'
import { SessionContext } from '../contexts/SessionContext.js';
import { BudgetDisplayContext } from '../contexts/BudgetDisplayContext.js';

let myBarChart;

function BarChart() {
  const { loggedIn, username } = useContext(SessionContext);
  const { hasAccount, setHasAccount, setDatabase } = useContext(BudgetDisplayContext);
  const token = window.localStorage.getItem("token");
  
  function createChart(data_source) {
    if (hasAccount) {
      var ctx = document.getElementById("myBarChart").getContext("2d");
        if (myBarChart) {
          myBarChart.destroy();
        }
        
        myBarChart = new ChartJS(ctx, {
        type: 'bar',
        data: data_source,
        options: {
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: `${data_source.title}`
            }
          }
        }
      });
    }
  };

  function getBudget() {
  	const db_name = (loggedIn && token) ? 'personal-budget' : 'guest-budget';

    (loggedIn && token) ?
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/show-account`,
    {
      username: username,
      database: db_name
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        database: db_name,
        username: username
      }
    })
    .then((res) => {
      // console.log('display-user');
      // console.log(res.data);
      if (res.data !== '') {
        setHasAccount(true);
        setDatabase(db_name);
        createChart(res.data);
      } else {
        setHasAccount(false)
      }
    })
    .catch((err) => {
      console.log(err);
    })
    :
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/display-guest`,
      {
        database: db_name,
        username: username
      }
    )
    .then((res) => {
      // console.log('display-guest');
      // console.log(res.data[0]);
      if (res.data !== '') {
        setDatabase(db_name);
        createChart(res.data[1]);
        setHasAccount(true);
      } 
    })
    .catch((err) => {
      console.log(err);
    });
  };
  
  getBudget();
  
  if (hasAccount) {
    return (
      <div className="bar">
          <canvas id="myBarChart"/>
      </div>
    )
  }
}

export default BarChart;