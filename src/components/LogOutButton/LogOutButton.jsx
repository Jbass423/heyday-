import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';

const LogoutButton = styled(Button)({
  backgroundColor: "#057",
  '&:hover': {
    backgroundColor: "#046",
  },
});

function LogOutButton(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    const userType = user.access_level;
    
    // Dispatch action to reset state
    // This is in our root reducer
    // and it deletes anything persisting
    // in state upon logout click
    dispatch({ type: 'RESET_STATE' });

    // clear welcome message seen local storage (Stored differently then reduc state, fyi)
    localStorage.removeItem('hasShownWelcome');

    // Redirect based on user type
    if (userType === 2) {
      history.push('/business-login');
    } else {
      history.push('/login');
    }
  };

  return (
    <LogoutButton
      variant="contained"
      className={props.className}
      onClick={handleLogout}
    >
      Log Out
    </LogoutButton>
  );
}

export default LogOutButton;