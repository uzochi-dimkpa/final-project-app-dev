import React from 'react';
import { useContext } from 'react';
import { SessionContext } from '../../contexts/SessionContext';
import { BudgetDisplayContext } from '../../contexts/BudgetDisplayContext';
import AddBudgetData from '../AddBudgetData/AddBudgetData';
import DonutChart from '../../charts/DonutChart';
import D3Chart from '../../charts/D3Chart';


function HomePage() {
	// console.log('Landed on the homepage!');

	const { loggedIn, username } = useContext(SessionContext);
	const { hasBudget } = useContext(BudgetDisplayContext);

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
									<D3Chart/>
								</>
							: (loggedIn && hasBudget) ?
								<>
									<h1>Welcome {username}!</h1>
									<p>
										We've gathered all of your budget information and displayed it for you below. 
									</p>
									<DonutChart/>
									<D3Chart/>
									<AddBudgetData/>
								</>
							:
								<>
									<h1>Welcome {username}!</h1>
									<p>
										<br/><br/>
										Don't have any budget information displayed here?
										<br/><br/>
										<strong>Take a minute to enter in some data!</strong>
									</p>
									<br/>
									<DonutChart/>
									<D3Chart/>
									{/* <h2>Enter some data to get started...</h2> */}
									<AddBudgetData/>
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
