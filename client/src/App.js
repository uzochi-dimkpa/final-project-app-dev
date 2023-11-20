import './App.scss';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Menu from './components/Menu/Menu';
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import HomePage from './components/HomePage/HomePage';
import AboutPage from './components/AboutPage/AboutPage';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import BreadCrumbs from './components/BreadCrumbs/BreadCrumbs';
import ContactPage from './components/ContactPage/ContactPage';

import { SessionContext } from './contexts/SessionContext';
import { useContext } from 'react';


function App() {
  const { loggedIn, username } = useContext(SessionContext);
  
  return (
    <Router>
      <Menu/>
      <Hero/>
      <BreadCrumbs/>

    <>
      {/* <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div> */}
    
      <Routes>
        <Route path="/about" element={<AboutPage/>} exact/>

        {!loggedIn && username === '' ?
        <Route path="/signup" element={<SignupPage/>} exact/>
        : null};

        {!loggedIn && username === '' ?
        <Route path="/login" element={<LoginPage/>} exact/>
        : null};
        
        <Route path="/contact" element={<ContactPage/>} exact/>
        
        <Route path="/" element={<HomePage/>} exact/>
      </Routes>
    </>
      
      <Footer/>
    </Router>
  );
}

export default App;
