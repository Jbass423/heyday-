import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserNavBar from '../UserNavBar/UserNavBar';
import { useSelector, useDispatch } from "react-redux";
import Box from '@mui/material/Box';
import './UserSearchHistory.css';

function UserSearchHistory() {
  const searchHistory = useSelector((store) => store.historyReducer);
  console.log("checking history", searchHistory);
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);
  
  useEffect(() => {
    dispatch({ type: 'FETCH_HISTORY' });
  }, [dispatch]);
  
  const handleDelete = (itemId) => {
    dispatch({ type: 'DELETE_ITEM', payload: itemId });
  };

  const filteredHistory = searchHistory.filter(
    (his) => Number(his.user_id) === Number(user.id)
  );
  console.log("checking his filt", filteredHistory);

  return (
    <div className="search-history-container">
      <center><h2 className='titleone'>Search History</h2></center>
      <div className="history-list">
        {filteredHistory.map((item) => (
          <Box 
            key={item.id}
            className="history-card"
          >
            <div>
              {item.business_id ? (
                <Link to={`/user-details/${item.business_id}`} className="btn_asLink">
                  <span>{item.name}</span>
                </Link>
              ) : (
                <span>{item.address}</span>
              )}
              {item.address && <span> - {item.address}</span>}
            </div>
            <button onClick={() => handleDelete(item.id)} className="delete-button">Delete</button>
          </Box>
        ))}
      </div>
      <div className='navfour'>
      <center><UserNavBar /></center></div>
    </div>
  );
}

export default UserSearchHistory;
