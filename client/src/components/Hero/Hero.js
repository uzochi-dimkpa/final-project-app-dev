import React, { useContext } from 'react';
import { SessionContext } from '../../contexts/SessionContext.js';

function Hero() {
  const { username } = useContext(SessionContext);
  
  return (
    // <div>
    //   Hero
    // </div>
    <div className="hero">
        {username === '' ?
        <h1 id="myH1">Your Personal Budget</h1>
        :
        <h1 id="myH1">{username}'s Personal Budget</h1>}
        <h2>A personal-budget management app</h2>
    </div>
  );
}

export default Hero;
