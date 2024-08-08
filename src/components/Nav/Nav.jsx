import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import UserHamburgerMenu from "../UserHamburgerMenu/UserHamburgerMenu"
function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
            <UserHamburgerMenu /> 
            


    </div>
  );
}

export default Nav;
