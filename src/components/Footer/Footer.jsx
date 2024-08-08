import React from 'react';
import './Footer.css';
import UserNavBar from '../UserNavBar/UserNavBar';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

function Footer() {
  return <div>
    
    <footer>&copy; Heyday, 2024</footer></div>
}

export default Footer;
