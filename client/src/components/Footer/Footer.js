import React from 'react';

function Footer() {
  return (
    // <div>
    //   Footer
    // </div>
    <>
        <div id='top'/>
        <footer className="bottom">
            <div className="center">
                <>All rights reserved &copy; 2023</> | <>Dimkpa Budgeting&trade;</>
            </div>
            <div style={{'marginTop': '0.5em'}}/>
            <div className="center">
                <em>Credits: Prof. Fabio Nolasco</em>
                &nbsp;|&nbsp;
                <em>Icons: flaticon.com</em>
            </div>
            <br></br>
        </footer>
    {/* <!-- This is an A11y Change --> */}
    {/* <div className="center">
        <button class="button button1" style={{"color":"black", "background-color": "lightgray", "height":"88px"}}>
            <h2>
                Go to top of page
            </h2>
        </button>
    </div> */}
    </>
  );
}

export default Footer;
