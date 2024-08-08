import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
import TheRippleEffect from '../TheRippleEffect/TheRippleEffect';
import './LoginPage.css'

function LoginPage() {
  const history = useHistory();

  return (
    <div>
      <TheRippleEffect/>
      <LoginForm />
      

      <center><div className='dntacc'>
  Don't have an account? <p></p></div>
  <button
    type="button"
    className="btn btn_asLink"
    onClick={() => {
      history.push('/registration');
    }}
  >
    Signup
  </button>
  <p></p>

  <button
    type="button"
    className="btn btn_asLink"
    onClick={() => {
      history.push('/business-login');
    }}
  >
    Access Business Portal
  </button>
  <p></p>
  
</center>

      
    </div>
    
  );
}

export default LoginPage;
