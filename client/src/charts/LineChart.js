import axios from 'axios';
import React, { useContext } from 'react';
import { Chart as ChartJS } from 'chart.js';
import 'chart.js/auto'
import { SessionContext } from '../contexts/SessionContext.js';
import { BudgetDisplayContext } from '../contexts/BudgetDisplayContext.js';

let myLineChart;

function LineChart() {
  const { loggedIn, username} = useContext(SessionContext);
  const { hasBudget, setHasBudget, setDatabase } = useContext(BudgetDisplayContext);
  const token = window.localStorage.getItem("token");
  
  function createChart(data_source) {
    if (hasBudget) {
      var ctx = document.getElementById("myLineChart").getContext("2d");
        if (myLineChart) {
          myLineChart.destroy();
        }
        
        myLineChart = new ChartJS(ctx, {
        type: 'line',
        data: data_source,
        options: {
          plugins: {
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
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/display-user`,
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
        createChart(res.data[2]);
      } else {
        setHasBudget(false)
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
        setHasBudget(true);
        setDatabase(db_name);
        createChart(res.data[2]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };
  
  getBudget();
  
  if (hasBudget) {
    return (
      <div className="line">
          <canvas id="myLineChart"/>
      </div>
    )
  }
}

export default LineChart;