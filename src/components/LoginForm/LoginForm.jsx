import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import {useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import "./LoginForm.css"
const LoginButton = styled(Button)({
  backgroundColor: "#057",
  '&:hover': {
    backgroundColor: "#046",
  },
});

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
  const user = useSelector(store => store.user); 
  const dispatch = useDispatch();
  const history = useHistory();


  useEffect(() => {
    if (user && user.access_level === 1) {
      history.push('/user-landing');
    } else if (user && user.access_level !== 1) {
      dispatch({ type: 'LOGIN_FAILED', payload: 'Invalid access level for user login' });
    }
  }, [user, history, dispatch]);

  useEffect(() => {
    dispatch({ type: 'CLEAR_LOGIN_ERROR' });
  }, [dispatch]);

const login = (event) => {
  event.preventDefault();

  if (username && password) {
    dispatch({
      type: 'LOGIN',
      payload: {
        username: username,
        password: password,
      },
    });
  } else {
    dispatch({ type: 'LOGIN_INPUT_ERROR' });
  }
};

  return (
    <form className="formPanel" onSubmit={login}>
      <center><h2 className='logone'>Login</h2></center> 
      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
        </h3>
      )}
      <div>
        <center><label htmlFor="username">
          Username:
          <input
            type="text"
            name="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label></center>
      </div>
      <div>
        <center><label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label></center>
      </div>
      <div>

      <center>
          <LoginButton
            type="submit"
            variant="contained"
            className="btn"
          >
            Log In
          </LoginButton>
        </center>
      </div>
    </form>
    
  );
}

export default LoginForm;
