import React from 'react';

import train from '../../images/train.gif';
import red_alert from '../../images/red-alert.gif';
import a_plus from '../../images/a-plus.gif';
import free from '../../images/free.gif';

function AboutPage() {
  return (
    <div className="container center">

      <div className="page-area">

        <main id="main">
          
        {/* <!-- This is a Semantic HTML Change --> */}
          <article className="text-box">
            <h1>Stay on track</h1>
            <p>
                Do you know where you are spending your money? If you really stop to track it down,
                you would get surprised! Proper budget management depends on real data... and this
                app will help you with that!
            </p>
            {/* <!-- This is an A11y Change --> */}
            <img src={train} alt="train" style={{width: "100px", height: "90px"}}/>
          </article>

          {/* <!-- This is a Semantic HTML Change --> */}
          <article className="text-box">
            <h1>Alerts</h1>
            <p>
                What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
            </p>
            {/* <!-- This is an A11y Change --> */}
            <img src={red_alert} alt="red alert warning danger" style={{width: "70px", height: "70px"}}/>
          </article>

          {/* <!-- This is a Semantic HTML Change --> */}
          <article className="text-box">
            <h1>Results</h1>
            <p>
                People who stick to a financial plan, budgeting every expense, get out of debt faster!
                Also, they to live happier lives... since they expend without guilt or fear... 
                because they know it is all good and accounted for.
            </p>
            <img src={a_plus} alt="a plus" style={{width: "100px", height: "70px"}}/>
          </article>

          {/* <!-- This is a Semantic HTML Change --> */}
          <article className="text-box">
            <h1>Free</h1>
            <p>
                This app is free!!! And you are the only one holding your data!
            </p>
            <img src={free} alt="free of charge" style={{width: "150px", height: "120px"}}/>
          </article>

        </main>
      </div>
    </div>
    // <div>
    //   AboutPage
    // </div>
  );
}

export default AboutPage;
