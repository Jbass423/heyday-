import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import UserNavBar from "../UserNavBar/UserNavBar";
import "./UserFavoriteLocations.css";

const StyledButton = styled(Button)({
  backgroundColor: "#057",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#046",
  },
  padding: "10px 20px",
  borderRadius: "5px",
  fontSize: "0.55em",
  marginRight: "10px",
  marginLeft: "10px",
  cursor: "pointer",
  width: "120px", 
  display: "flex",
  justifyContent: "center", 
});
  


function UserFavoriteLocations() {
  const user = useSelector((store) => store.user);
  const favorite = useSelector((store) => store.favorites);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (user && user.id) {
      dispatch({ type: "SET_FAVS", payload: user.id });
    }
  }, [dispatch, user]);

  const filteredFavs = favorite.filter(
    (fav) => Number(fav.user_id) === Number(user.id)
  );

  const handleDel = (id) => {
    dispatch({ type: "DELETE_FAVS", payload: { id } });
  };

  const handleViewDetails = (id) => {
    console.log(`Attempting to view details for favorite with id: ${id}`);
    console.log(`Navigating to: /user-details/${id}`);
    history.push(`/user-details/${id}`);
    console.log('Navigation completed');
  };


  return (
    <div className="favorite-locations-container">
      <center>
        <h1 className="titleone">Favorite Destinations</h1>
      </center>
      <h2 className="welcome">{user.username}'s List of Favorites:</h2>
      {filteredFavs.length > 0 ? (
        <div className="favorites-list">
          {filteredFavs.map((fav, index) => (
            <div key={index} className="favorite-card">
              <h3>{fav.name}</h3>
              <p>
                <strong>Address:</strong> {fav.address}
              </p>
              <div className="button-group">
                <StyledButton
                  onClick={() => handleViewDetails(fav.business_id)}
                >
                  View Details
                </StyledButton>
                <StyledButton onClick={() => handleDel(fav.id)}>
                  Delete
                </StyledButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorite locations found.</p>
      )}
      <div className="navone">
        <UserNavBar />
      </div>
    </div>
  );
}

export default UserFavoriteLocations;