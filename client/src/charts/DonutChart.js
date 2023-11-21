import axios from 'axios';
import React, { useContext } from 'react';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import 'chart.js/auto'
import { SessionContext } from '../contexts/SessionContext';
import { BudgetDisplayContext } from '../contexts/BudgetDisplayContext';

ChartJS.register(ArcElement);

let myDoughnutChart;

function DoughnutChart() {
  const { loggedIn, username} = useContext(SessionContext);
  const { hasBudget, setHasBudget, setDatabase } = useContext(BudgetDisplayContext);
  const token = window.localStorage.getItem("token");
  
  function createChart(data_source) {
    if (hasBudget) {
      var ctx = document.getElementById("myDonutChart").getContext("2d");
        if (myDoughnutChart) {
          myDoughnutChart.destroy();
        }
        
        myDoughnutChart = new ChartJS(ctx, {
        type: 'doughnut',
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
        createChart(res.data[0]);
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
        createChart(res.data[0]);
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
          <canvas id="myDonutChart"/>
      </div>
    )
  }
}

export default DoughnutChart;