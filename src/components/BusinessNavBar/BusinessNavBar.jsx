import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BarChartIcon from '@mui/icons-material/BarChart';
// We will need to change the icons above for the user nav bar here
// MUI makes it easy to import whatever buttons we need
// then we can just change the icon in the code below
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"
// We will need to change the icons above for the business nav bar here
// MUI makes it easy to import whatever buttons we need
// then we can just change the icon in the code below

export default function BusinessNavBar() {
    const [value, setValue] = React.useState(0);


    // Fix this so it routes back one single page instead of back to "/"
    
    let history = useHistory()
    
    
    
    
      return (
        <Box sx={{ width: 500 }}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Back" onClick={() => history.goBack()} icon={<ArrowBackIosIcon />} />
            <BottomNavigationAction label="Metrics" component={Link} icon={<BarChartIcon />} />
            <BottomNavigationAction label="Home" to="/business-landing" component={Link} icon={<HomeIcon />} />
          </BottomNavigation>
        </Box>
  );
}