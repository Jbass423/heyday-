import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button"; 
import { Link } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import "./UserHamburgerMenu.css"

// Styled link for menu items
const StyledLink = styled(Link)({
  color: "#FFFFFF",
  textDecoration: "none",
  width: "100%",
  display: "block",
  fontWeight: "bold",
  textDecoration: "underline",
});

const StyledMenuItem = styled(MenuItem)({
  backgroundColor: "#057",
  color: "#fff",
  '&:hover': {
    backgroundColor: "#046",
    color: "#FFFFFF"
  },
});

const StyButton = styled(Link)({
  color: "#FFFFFF",
  textDecoration: "underline",
  width: "100%",
  display: "block",
  fontWeight: "bold",
  padding: "6px 16px",
  backgroundColor: "#057",
  '&:hover': {
    backgroundColor: "#046",
    color: "#FFFFFF", 
    textDecoration: "underline", 
  },
});

export default function UserHamburgerMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector((store) => store.user);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1, width: "100%", backgroundColor: "#000" }}>
      <AppBar position="static" sx={{ width: "100%", backgroundColor: "#000" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, backgroundColor: "#000000" }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiPaper-root": {
                
                backgroundColor: "#0E0E0E",
                color: "#FFFFFF",
                textDecoration: "underline"
              },
              "& .MuiMenuItem-root": {
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#046",
                },
              },
            }}
          >
            {!user?.id ? (
              <MenuItem component={StyButton} to="/login" onClick={handleMenuClose}>
                Login
              </MenuItem>
            ) : user.access_level == 2 ? (
              <>
                <MenuItem component={StyButton} to="/business-landing" onClick={handleMenuClose}>
                  Business Home
                </MenuItem>
                <MenuItem component={StyButton} to="/edit-business-details" onClick={handleMenuClose}>
                  Edit Business Details
                </MenuItem>
                <MenuItem component={StyButton} to="/view-as-user" onClick={handleMenuClose}>
                  View As User
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem component={StyButton} to="/user-landing" onClick={handleMenuClose}>
                  Home
                </MenuItem>
                <MenuItem component={StyButton} to="/favorite-locations" onClick={handleMenuClose}>
                  Favorite Locations
                </MenuItem>
                <MenuItem component={StyButton} to="/user-search-history" onClick={handleMenuClose}>
                  Search History
                </MenuItem>
                <MenuItem component={StyButton} to="/happy" onClick={handleMenuClose}>
                  The Heystack
                </MenuItem>
              </>
            )}
            <MenuItem component={StyButton} to="/about" onClick={handleMenuClose}>
              Getting Started
            </MenuItem>
            {user?.id && (
              <MenuItem onClick={handleMenuClose}>
                <LogOutButton Button color="inherit" />
              </MenuItem>
            )}
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Menu
          </Typography>
          {user?.id && (
            <Button color="inherit">{/* Add Button Content Here */}</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}