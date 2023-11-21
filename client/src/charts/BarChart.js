import axios from 'axios';
import React, { useContext } from 'react';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import 'chart.js/auto'
import { SessionContext } from '../contexts/SessionContext';
import { BudgetDisplayContext } from '../contexts/BudgetDisplayContext';

ChartJS.register(ArcElement);

let myBarChart;

function BarChart() {
  const { loggedIn, username} = useContext(SessionContext);
  const { hasBudget, setHasBudget, setDatabase } = useContext(BudgetDisplayContext);
  const token = window.localStorage.getItem("token");
  
  function createChart(data_source) {
    if (hasBudget) {
      var ctx = document.getElementById("myBarChart").getContext("2d");
        if (myBarChart) {
          myBarChart.destroy();
        }
        
        myBarChart = new ChartJS(ctx, {
        type: 'bar',
        data: data_source,
      });
    }
  };

  function getBudget() {
  	const db_name = (loggedIn && token) ? 'personal-budget' : 'guest-budget';

    (loggedIn && token) ?
    axios.get('http://localhost:3010/display-user',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        database: db_name,
        username: username
      }
    })
    .then((res) => {
      // console.log('display-user');
      // console.log(res.data[0]);
      if (res.data !== '') {
        setHasBudget(true);
        setDatabase(db_name);
        createChart(res.data[1]);
      } else {
        setHasBudget(false)
      }
    })
    .catch((err) => {
      console.log(err);
    })
    :
    axios.post('http://localhost:3010/display-guest',
      {
        database: db_name,
        username: username
      }
    )
    .then((res) => {
      // console.log('display-guest');
      // console.log(res.data[0]);
      if (res.data !== '') {
        setHasBudget(true);
        setDatabase(db_name);
        createChart(res.data[1]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };
  
  getBudget();
  
  if (hasBudget) {
    return (
      <div className="chart-container">
          <canvas id="myBarChart"/>
      </div>
    )
  }
}

export default BarChart;