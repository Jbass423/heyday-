
import React from 'react';
import './TheRippleEffect.css';
import logo from "../../../public/image copy.png"

function TheRippleEffect() {
  return (
    <div className="loader-container">
      <div className="logo-container">
        <img src={logo} className="logo" alt="Logo" />
        <h2 className="heading-primary">HEYDAY</h2>
        <h12 className="heading-secondary">HAPPY HOUR APP</h12>
      </div>
      <div className="ripple"></div>
    </div>
  );
}

export default TheRippleEffect;
