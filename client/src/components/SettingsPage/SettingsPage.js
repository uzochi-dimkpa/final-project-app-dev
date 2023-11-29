import React, { useContext } from 'react';
import { SessionContext } from "../../contexts/SessionContext.js";
import DeleteAccountPopup from "../Popups/DeleteAccountPopup.js";
import AddAccountData from "../UpdateData/AddAccountData.js";
import BarChart from "../../charts/BarChart.js";
import user_icon from "../../images/user.png"


function SettingsPage() {
  const { username } = useContext(SessionContext);
  
  const showPopup = () => {
    document.getElementById('popup-overlay-2').style.display = 'block';
    document.getElementById('delete-account-popup').style.display = 'block';
  }

  return (
    <>
      <div id='settings-page-section'/>
      <div className="container center">
        <h1>{username}'s Account Settings</h1>
        <div className='center'>
          <img src={user_icon} alt="user icon placeholder" className='settings-profile-picture'/>
        </div>
        <BarChart/>
        <AddAccountData/>
        <div style={{"marginTop": "96px"}}/>
        <button className="delete-account-button" onClick={showPopup}>Delete Account</button>
        <DeleteAccountPopup/>
      </div>
    </>
  )
}


export default SettingsPage;