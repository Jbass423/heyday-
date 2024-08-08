import * as React from 'react';

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// We will need to change the icons above for the user nav bar here
// MUI makes it easy to import whatever buttons we need
// then we can just change the icon in the code below
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"
import './UserNavBar.css';
export default function UserNavBar() {
  const [value, setValue] = React.useState(0);


// Fix this so it routes back one single page instead of back to "/"

let history = useHistory()




  return (
    <Box className="nav-container" sx={{ width: '500px' }}>
      <BottomNavigation
        className="bottom-nav"
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Back" onClick={() => history.goBack()} icon={<ArrowBackIosIcon />} />
        <BottomNavigationAction label="Favorites" to="/favorite-locations" component={Link} icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Home" to="/user-landing" component={Link} icon={<HomeIcon />} />
      </BottomNavigation>
    </Box>
  );
}