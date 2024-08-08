
import React from 'react';
import './TheRippleBusiness.css';
import logo from './../../../../HeyDay/public/image copy.png'

function TheRippleBusiness() {
  return (
    <div className="loader-container">
      <div className="logo-container">
        <img src={logo} className="logo" alt="Logo" />
        <h2 className="heading-primary">HEYDAY</h2>
        <h12 className="heading-secondary">HAPPY HOUR APP</h12>
        <h4 className="heading-tertiary">Business</h4>

      </div>
      <div className="rippleThree"></div>
    </div>
  );
}

export default TheRippleBusiness;
