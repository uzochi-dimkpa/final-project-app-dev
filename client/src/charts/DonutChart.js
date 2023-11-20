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
  
  function createChart(data_source) {
    if (hasBudget) {
      var ctx = document.getElementById("myChart").getContext("2d");
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
  	// console.log('Display budget!');
  
  	const db_name = (loggedIn) ? 'personal-budget' : 'guest-budget';

    axios.post('http://localhost:3010/display',
      {
        database: db_name,
        username: username
      }
    )
    .then((res) => {
      if (res.data !== '') {
        createChart(res.data[0]);
        setHasBudget(true);
        setDatabase(db_name);
      } else {
        setHasBudget(false);
      }
    });
  };
  
  getBudget();
  
  if (hasBudget) {
    return (
      <div className="chart-container">
          <canvas id="myChart"/>
      </div>
    )
  }
}

export default DoughnutChart;