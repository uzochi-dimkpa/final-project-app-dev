import React, { useContext } from 'react';
import { SessionContext } from '../../contexts/SessionContext.js';
import { BudgetDisplayContext } from '../../contexts/BudgetDisplayContext.js';
import DeleteBudgetData from '../UpdateData/DeleteBudgetData.js';
import AddAccountData from '../UpdateData/AddAccountData.js';
import AddBudgetData from '../UpdateData/AddBudgetData.js';
import DonutChart from '../../charts/DonutChart.js';
import LineChart from '../../charts/LineChart.js';
import BarChart from '../../charts/BarChart.js';


function HomePage() {
	// console.log('Landed on the homepage!');

	const { loggedIn, username } = useContext(SessionContext);
	const { hasBudget } = useContext(BudgetDisplayContext);

	// Scroll to change data fields section
  const scrollToFields = () => {
    setTimeout(
      () => {
        document.getElementById('enter-data-fields').scrollIntoView({
          behavior: 'smooth'
        });
      },
      150
    );
  }

	return (
		<>
			<div className="container center">

				{/* <div id='view-budget-data'/> */}
				
				<main id="main">
								
					{/* <!-- This is a Semantic HTML Change --> */}
					<aside>
						{/* <!-- This is a Semantic HTML Change --> */}

						<article className="text-box">
							{
							!loggedIn && username === '' ?
								<>
									<h1>Take it for a spin!</h1>
									<p>
										Try it out! Take a look at some of the features below. Poke around a bit
										to get a feel for the app for yourself!
									</p>
									<DonutChart/>
									<br/>
									<BarChart/>
									<br/>
									<LineChart/>
								</>
							: (loggedIn && username && hasBudget) ?
								<>
									<h1>Welcome {username}!</h1>
									<p>
										We've gathered all of your budget information and displayed it for you below. 
									</p>
									<DonutChart/>
									<br/>
									<BarChart/>
									<br/>
									<LineChart/>
									{/* <h2>Enter some data to get started...</h2> */}
									<hr/>
									<div id='enter-data-fields'/>
									{/* <br/><br/><br/> */}
									<AddBudgetData/>
									{/* <br/><br/> */}
									<AddAccountData/>
									{/* <br/><br/> */}
									<DeleteBudgetData/>
								</>
							:
								<>
									<h1>Welcome {username}!</h1>
									<p>
										<br/><br/>
										Don't have any budget information displayed here?
										<br/><br/>
										<strong>Take a minute to <span style={{"textDecoration": "underline", "cursor": "pointer"}} onClick={scrollToFields}>enter in some data!</span></strong>
									</p>
									<br/>
									<DonutChart/>
									<br/>
									<BarChart/>
									<br/>
									<LineChart/>
									{/* <h2>Enter some data to get started...</h2> */}
									<hr/>
									<div id='enter-data-fields'/>
									{/* <br/><br/><br/> */}
									<AddBudgetData/>
									{/* <br/><br/> */}
									<AddAccountData/>
								</>
							}
						</article>
					</aside>
					{/* <PieChart/>
					<D3Chart/> */}
					{/* <D3Chart data={final_data} innerRadius={0} outerRadius={350}/> */}
				</main>

			</div>
		</>
  );
}

export default HomePage;
