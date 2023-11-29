import axios from "axios";
import React, { useContext, useState } from 'react';
import { SessionContext } from "../../contexts/SessionContext.js";


function ContactPage() {
  const { username } = useContext(SessionContext);
  // ...

  return (
    <>
      <div id='contact-page-section'/>
      <div className="container center">
        <h1>Contact Page</h1>
        <h1 style={{"color": "red"}}>TODO: CONTACT SITE ADMIN FUNCTIONALITY</h1>
        <div style={{"marginTop": "2048px"}}/>
      </div>
    </>
  )
}


export default ContactPage;