
/*                                                                                                                    
 _ _ _       _                          _           _____            ____            
| | | | ___ | | ___  ___  _____  ___   | |_  ___   |  |  | ___  _ _ |    \  ___  _ _ 
| | | || -_|| ||  _|| . ||     || -_|  |  _|| . |  |     || -_|| | ||  |  || .'|| | |
|_____||___||_||___||___||_|_|_||___|  |_|  |___|  |__|__||___||_  ||____/ |__,||_  |
                                                               |___|            |___|          
*/
// move to readme ^^^
import React, { useRef, useEffect, useState } from "react"; // useRef for mutable vals or for things that shouldn't affect comp. rendering (aka can access and manipulate DOM directly basically)
import { Wrapper, Status } from "@googlemaps/react-wrapper"; // import wrapper, and status (used in the renderStatus function) method, for the Google API
import UserNavBar from "../UserNavBar/UserNavBar"; // import mui comp
import Buttons from "../Buttons/Buttons"; // import mui comp.
import Box from "@mui/material/Box"; // mui library import
import Button from "@mui/material/Button"; // mui library import 
import Typography from "@mui/material/Typography"; // mui library import
import LogOutButton from "../LogOutButton/LogOutButton"; // logout comp
import { useSelector, useDispatch } from "react-redux";
import L, { icon } from "leaflet"; // feel free to delete before client-hand off, we are not using this anymore
import "leaflet/dist/leaflet.css"; // feel free to delete before client-hand off, we are not using this anymore
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import './UserLanding.css'
import business from "../../redux/reducers/business.reducer";

/*
General notes and reminders for Heyday friends about the UserLanding function:
This is the core functionality of the App, as such, it is detailed with the utmost care
and precision for future developer reference and readability. Good documentation is a foundational
pillar of clean code and modular, reusable engineering standards that this Dev team is deeply committed to!
Cheers,
Team Heyday
*/
/*
Team Notes:
new keyword creates instances of a class
global scope window object in javascript represents browser window (allows us to manipulate map elements in a more dynamic/fluid fashion)
*/
function UserLanding() {
    const history = useHistory();
    const [showWelcome, setShowWelcome] = useState(false);
    const [hasShownWelcome, setHasShownWelcome] = useState(() => {
      return localStorage.getItem('hasShownWelcome') === 'true';
    });
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const businesses = useSelector(state => state.business);
  
    useEffect(() => {
      console.log("Checking welcome message condition");
      console.log("User data:", user);
  
      if (user && user.id && !hasShownWelcome) {
        console.log("Setting showWelcome to true");
        setShowWelcome(true);
        setHasShownWelcome(true);
        localStorage.setItem('hasShownWelcome', 'true');
  
        const timer = setTimeout(() => {
          console.log("Timer expired, setting showWelcome to false");
          setShowWelcome(false);
        }, 10000);
  
        return () => clearTimeout(timer);
      }
    }, [user, hasShownWelcome]);
  
    const handleDismissWelcome = () => {
      setShowWelcome(false);
    };

  useEffect(() => {
    console.log("User data:", user);
  }, [user]);

  
  async function loadCityGeoJSON(cityName) {
    try {
      console.log("Attempting to fetch GeoJSON for:", cityName);
      const response = await fetch(`/mn/${cityName}.json`);
      if (!response.ok) {
        throw new Error('City data not found');
      }
      const data = await response.json();
      console.log("GeoJSON data loaded successfully");
      return data;
    } catch (error) {
      console.error('Error loading city data:', error);
      return null;
    }
  }
  // fetch history on component load (for search history)
  useEffect(() => {
    dispatch({ type: "FETCH_HISTORY" });
  }, [dispatch]);


  useEffect(() => {
    dispatch({ type: "FETCH_ALL_BUSINESSES" });
  }, [dispatch]);

  // this function uses methods to handle navigate different map loading statuses, if still loading the first div in
  // switch is shown, in the case of a failed load, return the second div, else return null
/**
 * 
 * @param {""} status 
 * @returns 
 */
  const renderStatus = (status) => {
    switch (status) {
      case Status.LOADING:
        return <div>Loading...</div>;
      case Status.FAILURE:
        return <div>Failed to load the map</div>;
      default:
        return null;
    }
  };
  // component that renders the Google map; passed center object that has lat and lng
  // zoom, which is the zoom level based on a int value
  // boundaries for how we will draw polygons and perimeter outlines (still considering using a GeoJSON file alongside this)
  // currentLocation for the function handleGetcurrentLocation and our button that gets user location
  const GoogleMapComponent = ({ center, zoom, boundaries, currentLocation }) => {
    const mapRef = useRef(null);
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [map, setMap] = useState(null);
    const [cityBoundary, setCityBoundary] = useState(null);
    const [markers, setMarkers] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();
    const [userLocationCircle, setUserLocationCircle] = useState(null);


    function getCoordinates(businessAddress) {
        if (typeof businessAddress !== 'string') {
            console.error('Invalid address:', businessAddress);
            return Promise.resolve(null);
        }
    
        const geocoder = new google.maps.Geocoder();
        return new Promise((resolve, reject) => {
            geocoder.geocode({ address: businessAddress }, (results, status) => {
                if (status === 'OK') {
                    resolve({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    });
                } else {
                    console.error('Geocoding failed:', status);
                    resolve(null);
                }
            });
        });
    }
    // handleSearch is an arrow function that takes a place parameter
    // and adds the name (place.name) of it to the users history
    
    const handleSearch = (place) => {
      console.log("handleSearch clicked", place.name);
      dispatch({
        type: "ADD_HISTORY",
        payload: { search_history: place.name, address: place.address},
      });
    };

    const drawCityBoundary = (mapInstance, geoJSON) => {
        console.log("drawCityBoundary called with:", {mapInstance, geoJSON});
        if (mapInstance && geoJSON) {
          // Remove the previous boundary if it exists
          if (cityBoundary) {
            cityBoundary.setMap(null);
          }
      
          const boundary = new google.maps.Data();
          try {
            boundary.addGeoJson(geoJSON);
            console.log("GeoJSON added to boundary");
          } catch (error) {
            console.error("Error adding GeoJSON to boundary:", error);
            return;
          }
      
          boundary.setStyle({
            fillColor: "#ADD8E6",
            fillOpacity: 0.3,
            strokeColor: "#1E90FF",
            strokeOpacity: 0.8,
            strokeWeight: 5
          });
      
          boundary.setMap(mapInstance);
          setCityBoundary(boundary);
          console.log("Boundary set on map");
      
          const bounds = new google.maps.LatLngBounds();
          boundary.forEach((feature) => {
            console.log("Processing feature:", feature);
            const geometry = feature.getGeometry();
            if (geometry) {
              geometry.forEachLatLng((latLng) => {
                bounds.extend(latLng);
              });
            }
          });
          
          if (!bounds.isEmpty()) {
            mapInstance.fitBounds(bounds);
            console.log("Map bounds updated:", bounds.toString());
          } else {
            console.log("Bounds are empty");
          }
        } else {
          console.log("Map or GeoJSON data is missing", {mapInstance, geoJSON});
        }
      };
  
      const searchDatabasePlaces = async (mapInstance, searchLocation) => {
        try {
          const response = await fetch('/api/business/all-details');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const businesses = await response.json();
          console.log('Fetched businesses:', businesses);
    
          // Clear existing markers
          markers.forEach(marker => marker.setMap(null));
          setMarkers([]);
    
          const newMarkers = [];
          for (const business of businesses) {
            const coords = await getCoordinates(business.address);
            if (coords) {
              const icon = {
                url: '/public/icons8-map-pin-26.png',
                scaledSize: new google.maps.Size(30, 30),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 15)
              };
              const marker = new google.maps.Marker({
                position: coords,
                map: mapInstance,
                title: business.business_name,
                icon: icon
              });

              const infoWindow = new google.maps.InfoWindow({
                 content: `<div><h3>${business.business_name}</h3><p><h3>${business.address}</h3></p><p>${business.description || 'No description available'}</p></div>`
              });

              marker.addListener('mouseover', () => {
                infoWindow.open(mapInstance, marker);
              });
      
              marker.addListener('mouseout', () => {
                infoWindow.close();
              });

              marker.addListener('click', () => {
                dispatch({ type: 'ADD_HISTORY', payload: {  userId: user.id, businessId: businesses.id,  name: businesses.business_name, address: businesses.address} });
                history.push(`/user-details/${business.id}`);
              });
    
              newMarkers.push(marker);
            }
          }
          setMarkers(newMarkers);
        } catch (error) {
          console.error('Error in searchDatabasePlaces:', error);
        }
      };
    
      useEffect(() => {
        if (mapRef.current && !map) {
          const mapInstance = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 5,
            mapId: "2182bd31b6274e24",
          });
      
          setMap(mapInstance);
      
          if (inputRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
            autocompleteRef.current.bindTo("bounds", mapInstance);
      
            autocompleteRef.current.addListener("place_changed", async () => {
              const place = autocompleteRef.current.getPlace();
              console.log("Selected place:", place);
      
              if (!place.geometry || !place.geometry.location) {
                console.log("No geometry for place:", place);
                return;
              }
      
              // Remove the previous boundary if it exists
              if (cityBoundary) {
                cityBoundary.setMap(null);
                setCityBoundary(null);
              }
      
              if (place.types.includes('locality') && 
                  place.address_components.some(component => 
                    component.short_name === 'MN' && component.types.includes('administrative_area_level_1'))) {
                console.log("Minnesota city selected");
                const cityName = place.name.replace(/\s+/g, '_').toLowerCase();
                console.log("Fetching GeoJSON for:", cityName);
                const cityData = await loadCityGeoJSON(cityName);
                if (cityData) {
                  console.log("Calling drawCityBoundary with:", cityData);
                  drawCityBoundary(mapInstance, cityData);
                } else {
                  console.log("No GeoJSON data available for:", cityName);
                }
              } else {
                console.log("Non-Minnesota city or non-city place selected");
                if (place.geometry.viewport) {
                  console.log("Fitting to viewport");
                  mapInstance.fitBounds(place.geometry.viewport);
                } else {
                  console.log("Centering on location");
                  mapInstance.setCenter(place.geometry.location);
                  mapInstance.setZoom(17);
                }
              }
      
              // Search for businesses after a place is selected
              await searchDatabasePlaces(mapInstance, place.geometry.location);
      

              dispatch({ type: "FETCH_HISTORY" });
            });
          }
        }
      }, [center, zoom, boundaries, map, dispatch]);
  
    useEffect(() => {
      if (map && currentLocation) {
        console.log("Updating map with current location:", currentLocation);
        const iconHeart = {
          url: '/public/heartpin.png',
          scaledSize: new window.google.maps.Size(30, 30),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15)
        };
        new window.google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "Your Location",
          icon: iconHeart
        });
        if (userLocationCircle) {
            userLocationCircle.setMap(null);
          }

          const circle = new window.google.maps.Circle({
            strokeColor: '#A9A9A9', 
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#D3D3D3', 
            fillOpacity: 0.3,    
            map: map,
            center: currentLocation,
            radius: 2000 // 2000 meter radius
          });
      
          setUserLocationCircle(circle);
      
          map.setCenter(currentLocation);
          map.setZoom(15); 
        }
      }, [currentLocation, map]);
      
  
    return (
      <div style={{ height: "500px", width: "100%" }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by city, address or state"
          style={{
            boxSizing: "border-box",
            border: "1px solid transparent",
            width: "240px",
            height: "32px",
            marginTop: "10px",
            padding: " 10px",
            borderRadius: "3px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
            fontSize: "14px",
            outline: "none",
            textOverflow: "ellipsis",
            position: "absolute",
            top: "55px",
            left: "50%",
            marginLeft: "-120px",
            zIndex: 5,
          }}
        />
          <Box
            sx={{
              width: '90%',
              height: '70%',
              margin: '5px auto',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              
            }}
            ref={mapRef}
          ></Box>
      </div>
    );
  };
  // MapWrapper to set state info and handle general geolocation features, like getting current user location
  // we need this to ensure the button "Get Current Location"" works as intended
  const MapWrapper = () => {
    const [filteredData, setFilteredData] = useState([]);

    const handleFilterChange = (newFilteredData) => {
      setFilteredData(newFilteredData);
    };
    // getter and setter for currentLoc state management, init as null so location isn't a default given (maybe change this later?)
    const [currentLocation, setCurrentLocation] = useState(null);
    // select current logged in user from the redux store
    const user = useSelector((store) => store.user);

    const handleRandomButton = () => {
        const eligibleBusinesses = businesses.filter(business => business.id < 10);

        if (eligibleBusinesses.length > 0) {
          const randomIndex = Math.floor(Math.random() * eligibleBusinesses.length);
          const randomBusiness = eligibleBusinesses[randomIndex];
        history.push(`/user-details/${randomBusiness.id}`);
      } else {
        console.log("No businesses available");
      }
    };

    // function that gets current users location
    const handleGetCurrentLocation = () => {
        // if location services are allowed by the browser (AKA a geolocation supported browser)
      if (navigator.geolocation) {
        // test via console log, delete later
        console.log("in current location");
        // Method that is part of the Google Geolocation API (wrappers ftw) 
        // it allows applications to get the location of devices (granted the support above is allowed via the browser)
        // Callback: after location is succesfully gathered, callback function below 
        // is given a position object with the users geographic position data
        // (the position object includes a bunch of misc. data, but we only want lat and lng)
        // this object contains latitude and longitude that we can use to set the state of 
        // a users current location via setCurrentLocation
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          // log any errors and what the error is
          (error) => {
            console.error("Error retrieving location:", error);
          }
        );
        // if browser doesn't support geoloc. detection, lets let the users know it!
      } else {
        alert("Geolocation not supported by this browser.");
      }
    };
    const boundaries = [
        // Boundary array for Minneapolis
        [
          { lat: 44.941422, lng: -93.329163 },
          { lat: 44.943611, lng: -93.329124 },
          { lat: 44.944378, lng: -93.329109 },
          { lat: 44.945543, lng: -93.328834 },
          { lat: 44.945608, lng: -93.328826 },
          { lat: 44.945808, lng: -93.328826 },
          { lat: 44.946621, lng: -93.32888 },
          { lat: 44.947864, lng: -93.328854 },
          { lat: 44.947897, lng: -93.328853 },
          { lat: 44.948294, lng: -93.32885 },
          { lat: 44.948483, lng: -93.32885 },
          { lat: 44.948544, lng: -93.32885 },
          { lat: 44.948667, lng: -93.328888 },
          { lat: 44.948781, lng: -93.328903 },
          { lat: 44.948927, lng: -93.3289 },
          { lat: 44.949029, lng: -93.328886 },
          { lat: 44.949158, lng: -93.328845 },
          { lat: 44.949372, lng: -93.328794 },
          { lat: 44.949515, lng: -93.328757 },
          { lat: 44.949763, lng: -93.328748 },
          { lat: 44.95053, lng: -93.328791 },
          { lat: 44.95133, lng: -93.328786 },
          { lat: 44.952063, lng: -93.32878 },
          { lat: 44.953674, lng: -93.328768 },
          { lat: 44.95384, lng: -93.328768 },
          { lat: 44.956313, lng: -93.328752 },
          { lat: 44.956373, lng: -93.328751 },
          { lat: 44.956732, lng: -93.328749 },
          { lat: 44.956903, lng: -93.328748 },
          { lat: 44.957359, lng: -93.328745 },
          { lat: 44.958365, lng: -93.328738 },
          { lat: 44.959332, lng: -93.328731 },
          { lat: 44.960122, lng: -93.328725 },
          { lat: 44.960141, lng: -93.328726 },
          { lat: 44.961382, lng: -93.328717 },
          { lat: 44.961651, lng: -93.328716 },
          { lat: 44.961843, lng: -93.328715 },
          { lat: 44.962123, lng: -93.328713 },
          { lat: 44.962481, lng: -93.328709 },
          { lat: 44.964489, lng: -93.328701 },
          { lat: 44.964528, lng: -93.328702 },
          { lat: 44.96479, lng: -93.328699 },
          { lat: 44.965038, lng: -93.328697 },
          { lat: 44.966484, lng: -93.328692 },
          { lat: 44.966563, lng: -93.328692 },
          { lat: 44.967697, lng: -93.328688 },
          { lat: 44.968117, lng: -93.328686 },
          { lat: 44.968182, lng: -93.328687 },
          { lat: 44.968243, lng: -93.328686 },
          { lat: 44.969451, lng: -93.328681 },
          { lat: 44.969643, lng: -93.32868 },
          { lat: 44.969872, lng: -93.328672 },
          { lat: 44.969922, lng: -93.328678 },
          { lat: 44.97002, lng: -93.328691 },
          { lat: 44.970136, lng: -93.328689 },
          { lat: 44.97027, lng: -93.328687 },
          { lat: 44.971247, lng: -93.328673 },
          { lat: 44.974518, lng: -93.32866 },
          { lat: 44.977142, lng: -93.328654 },
          { lat: 44.977142, lng: -93.328572 },
          { lat: 44.977142, lng: -93.328445 },
          { lat: 44.977146, lng: -93.328156 },
          { lat: 44.977169, lng: -93.327873 },
          { lat: 44.977175, lng: -93.327838 },
          { lat: 44.977188, lng: -93.327763 },
          { lat: 44.977185, lng: -93.32615 },
          { lat: 44.977186, lng: -93.325932 },
          { lat: 44.977184, lng: -93.324983 },
          { lat: 44.977179, lng: -93.321673 },
          { lat: 44.977153, lng: -93.320446 },
          { lat: 44.977158, lng: -93.318643 },
          { lat: 44.977158, lng: -93.318545 },
          { lat: 44.977158, lng: -93.318527 },
          { lat: 44.977158, lng: -93.318453 },
          { lat: 44.977158, lng: -93.318407 },
          { lat: 44.977173, lng: -93.318396 },
          { lat: 44.977193, lng: -93.318381 },
          { lat: 44.977241, lng: -93.318367 },
          { lat: 44.977298, lng: -93.318372 },
          { lat: 44.977438, lng: -93.318426 },
          { lat: 44.977567, lng: -93.318471 },
          { lat: 44.97765, lng: -93.318495 },
          { lat: 44.97783, lng: -93.318524 },
          { lat: 44.978947, lng: -93.31852 },
          { lat: 44.980747, lng: -93.318504 },
          { lat: 44.981737, lng: -93.318469 },
          { lat: 44.983116, lng: -93.318468 },
          { lat: 44.983936, lng: -93.318469 },
          { lat: 44.984051, lng: -93.318468 },
          { lat: 44.98445, lng: -93.318469 },
          { lat: 44.984511, lng: -93.318469 },
          { lat: 44.984879, lng: -93.318468 },
          { lat: 44.98494, lng: -93.318468 },
          { lat: 44.985185, lng: -93.318469 },
          { lat: 44.985534, lng: -93.318468 },
          { lat: 44.986699, lng: -93.318468 },
          { lat: 44.986907, lng: -93.318468 },
          { lat: 44.986965, lng: -93.318468 },
          { lat: 44.987539, lng: -93.318467 },
          { lat: 44.987656, lng: -93.318467 },
          { lat: 44.987949, lng: -93.318481 },
          { lat: 44.98975, lng: -93.318481 },
          { lat: 44.990094, lng: -93.318467 },
          { lat: 44.991319, lng: -93.318466 },
          { lat: 44.991558, lng: -93.318467 },
          { lat: 44.993415, lng: -93.318465 },
          { lat: 44.995251, lng: -93.318466 },
          { lat: 44.995433, lng: -93.318466 },
          { lat: 44.997047, lng: -93.318466 },
          { lat: 44.99794, lng: -93.318466 },
          { lat: 44.998856, lng: -93.318459 },
          { lat: 44.998906, lng: -93.318459 },
          { lat: 45.000637, lng: -93.318448 },
          { lat: 45.001041, lng: -93.318446 },
          { lat: 45.001431, lng: -93.31853 },
          { lat: 45.001584, lng: -93.318565 },
          { lat: 45.001741, lng: -93.3186 },
          { lat: 45.001765, lng: -93.318566 },
          { lat: 45.001825, lng: -93.318534 },
          { lat: 45.002651, lng: -93.318527 },
          { lat: 45.004555, lng: -93.318527 },
          { lat: 45.0056, lng: -93.31852 },
          { lat: 45.006042, lng: -93.31852 },
          { lat: 45.007839, lng: -93.31852 },
          { lat: 45.009647, lng: -93.31852 },
          { lat: 45.010205, lng: -93.318517 },
          { lat: 45.011491, lng: -93.318514 },
          { lat: 45.011577, lng: -93.318514 },
          { lat: 45.011705, lng: -93.318513 },
          { lat: 45.012869, lng: -93.318499 },
          { lat: 45.013246, lng: -93.318494 },
          { lat: 45.013377, lng: -93.318492 },
          { lat: 45.013427, lng: -93.318492 },
          { lat: 45.013489, lng: -93.318491 },
          { lat: 45.013771, lng: -93.318474 },
          { lat: 45.014252, lng: -93.318436 },
          { lat: 45.015068, lng: -93.318436 },
          { lat: 45.016865, lng: -93.318428 },
          { lat: 45.018677, lng: -93.318436 },
          { lat: 45.020473, lng: -93.318436 },
          { lat: 45.022282, lng: -93.318481 },
          { lat: 45.024094, lng: -93.318527 },
          { lat: 45.025906, lng: -93.318573 },
          { lat: 45.027718, lng: -93.318619 },
          { lat: 45.029533, lng: -93.318665 },
          { lat: 45.031342, lng: -93.318703 },
          { lat: 45.033398, lng: -93.318748 },
          { lat: 45.035458, lng: -93.318794 },
          { lat: 45.035451, lng: -93.319167 },
          { lat: 45.035451, lng: -93.319419 },
          { lat: 45.035461, lng: -93.31942 },
          { lat: 45.036443, lng: -93.319427 },
          { lat: 45.036606, lng: -93.319435 },
          { lat: 45.036709, lng: -93.319427 },
          { lat: 45.036808, lng: -93.319374 },
          { lat: 45.036896, lng: -93.31929 },
          { lat: 45.036938, lng: -93.319224 },
          { lat: 45.037354, lng: -93.31924 },
          { lat: 45.037666, lng: -93.319252 },
          { lat: 45.038556, lng: -93.319275 },
          { lat: 45.040129, lng: -93.319304 },
          { lat: 45.04018, lng: -93.319305 },
          { lat: 45.040419, lng: -93.319315 },
          { lat: 45.040421, lng: -93.319415 },
          { lat: 45.040424, lng: -93.319959 },
          { lat: 45.040433, lng: -93.321071 },
          { lat: 45.040434, lng: -93.321332 },
          { lat: 45.040447, lng: -93.323127 },
          { lat: 45.040448, lng: -93.323233 },
          { lat: 45.040577, lng: -93.323208 },
          { lat: 45.041001, lng: -93.323138 },
          { lat: 45.041154, lng: -93.323112 },
          { lat: 45.042007, lng: -93.32297 },
          { lat: 45.042107, lng: -93.322953 },
          { lat: 45.042644, lng: -93.322606 },
          { lat: 45.0421, lng: -93.320305 },
          { lat: 45.042072, lng: -93.320186 },
          { lat: 45.041902, lng: -93.319433 },
          { lat: 45.042022, lng: -93.319433 },
          { lat: 45.04217, lng: -93.319433 },
          { lat: 45.042423, lng: -93.319434 },
          { lat: 45.043968, lng: -93.319435 },
          { lat: 45.044013, lng: -93.319435 },
          { lat: 45.045788, lng: -93.31942 },
          { lat: 45.047596, lng: -93.319443 },
          { lat: 45.049431, lng: -93.319473 },
          { lat: 45.05125, lng: -93.319496 },
          { lat: 45.051247, lng: -93.31823 },
          { lat: 45.051247, lng: -93.316963 },
          { lat: 45.051247, lng: -93.316765 },
          { lat: 45.051243, lng: -93.315674 },
          { lat: 45.051239, lng: -93.314423 },
          { lat: 45.051239, lng: -93.314187 },
          { lat: 45.051239, lng: -93.313164 },
          { lat: 45.051235, lng: -93.311905 },
          { lat: 45.051235, lng: -93.310646 },
          { lat: 45.051235, lng: -93.30938 },
          { lat: 45.05122, lng: -93.308075 },
          { lat: 45.051206, lng: -93.306879 },
          { lat: 45.051208, lng: -93.306816 },
          { lat: 45.051204, lng: -93.306753 },
          { lat: 45.051194, lng: -93.305605 },
          { lat: 45.051197, lng: -93.305542 },
          { lat: 45.051192, lng: -93.305479 },
          { lat: 45.051182, lng: -93.304306 },
          { lat: 45.051182, lng: -93.30426 },
          { lat: 45.05117, lng: -93.303017 },
          { lat: 45.051169, lng: -93.302968 },
          { lat: 45.051167, lng: -93.302895 },
          { lat: 45.051155, lng: -93.301712 },
          { lat: 45.051147, lng: -93.300516 },
          { lat: 45.051144, lng: -93.300453 },
          { lat: 45.051146, lng: -93.30039 },
          { lat: 45.051136, lng: -93.299194 },
          { lat: 45.051136, lng: -93.29792 },
          { lat: 45.051132, lng: -93.296638 },
          { lat: 45.051132, lng: -93.295364 },
          { lat: 45.051132, lng: -93.295334 },
          { lat: 45.051128, lng: -93.29409 },
          { lat: 45.051128, lng: -93.294052 },
          { lat: 45.051128, lng: -93.292809 },
          { lat: 45.051128, lng: -93.291527 },
          { lat: 45.051128, lng: -93.290245 },
          { lat: 45.051128, lng: -93.288963 },
          { lat: 45.051125, lng: -93.287682 },
          { lat: 45.051125, lng: -93.2864 },
          { lat: 45.051125, lng: -93.285871 },
          { lat: 45.051125, lng: -93.285313 },
          { lat: 45.051125, lng: -93.284984 },
          { lat: 45.051123, lng: -93.284386 },
          { lat: 45.051121, lng: -93.283524 },
          { lat: 45.051156, lng: -93.283095 },
          { lat: 45.051165, lng: -93.282226 },
          { lat: 45.047218, lng: -93.281454 },
          { lat: 45.047199, lng: -93.28145 },
          { lat: 45.047173, lng: -93.281445 },
          { lat: 45.043565, lng: -93.280826 },
          { lat: 45.039665, lng: -93.282126 },
          { lat: 45.035365, lng: -93.283426 },
          { lat: 45.035365, lng: -93.282956 },
          { lat: 45.035365, lng: -93.282486 },
          { lat: 45.035365, lng: -93.282426 },
          { lat: 45.035373, lng: -93.282053 },
          { lat: 45.035465, lng: -93.278026 },
          { lat: 45.035465, lng: -93.278013 },
          { lat: 45.035466, lng: -93.277969 },
          { lat: 45.035466, lng: -93.277354 },
          { lat: 45.035465, lng: -93.276282 },
          { lat: 45.035465, lng: -93.276029 },
          { lat: 45.035465, lng: -93.275884 },
          { lat: 45.035465, lng: -93.275717 },
          { lat: 45.035465, lng: -93.275223 },
          { lat: 45.035465, lng: -93.273528 },
          { lat: 45.035465, lng: -93.273307 },
          { lat: 45.035465, lng: -93.273211 },
          { lat: 45.035465, lng: -93.273146 },
          { lat: 45.035465, lng: -93.273073 },
          { lat: 45.035465, lng: -93.272826 },
          { lat: 45.035503, lng: -93.272029 },
          { lat: 45.035465, lng: -93.271726 },
          { lat: 45.035495, lng: -93.270045 },
          { lat: 45.035522, lng: -93.268553 },
          { lat: 45.035537, lng: -93.26774 },
          { lat: 45.035538, lng: -93.26767 },
          { lat: 45.035542, lng: -93.267607 },
          { lat: 45.035542, lng: -93.266388 },
          { lat: 45.035542, lng: -93.265099 },
          { lat: 45.035542, lng: -93.263809 },
          { lat: 45.035544, lng: -93.262898 },
          { lat: 45.035544, lng: -93.26274 },
          { lat: 45.035545, lng: -93.262497 },
          { lat: 45.035545, lng: -93.262037 },
          { lat: 45.035544, lng: -93.261088 },
          { lat: 45.035544, lng: -93.261048 },
          { lat: 45.035544, lng: -93.260803 },
          { lat: 45.035544, lng: -93.260108 },
          { lat: 45.035544, lng: -93.260016 },
          { lat: 45.035544, lng: -93.259918 },
          { lat: 45.035544, lng: -93.258458 },
          { lat: 45.035545, lng: -93.257462 },
          { lat: 45.035546, lng: -93.255527 },
          { lat: 45.035546, lng: -93.255469 },
          { lat: 45.035546, lng: -93.255455 },
          { lat: 45.035547, lng: -93.253851 },
          { lat: 45.035548, lng: -93.253294 },
          { lat: 45.035548, lng: -93.253223 },
          { lat: 45.035548, lng: -93.253164 },
          { lat: 45.035548, lng: -93.25227 },
          { lat: 45.035549, lng: -93.251183 },
          { lat: 45.035549, lng: -93.251145 },
          { lat: 45.035549, lng: -93.251114 },
          { lat: 45.035549, lng: -93.250229 },
          { lat: 45.035549, lng: -93.249847 },
          { lat: 45.035553, lng: -93.248558 },
          { lat: 45.035553, lng: -93.247387 },
          { lat: 45.035553, lng: -93.24721 },
          { lat: 45.035561, lng: -93.246017 },
          { lat: 45.035564, lng: -93.245427 },
          { lat: 45.035564, lng: -93.24536 },
          { lat: 45.035566, lng: -93.245013 },
          { lat: 45.035568, lng: -93.244774 },
          { lat: 45.035568, lng: -93.244728 },
          { lat: 45.035572, lng: -93.244103 },
          { lat: 45.035576, lng: -93.243706 },
          { lat: 45.035575, lng: -93.242966 },
          { lat: 45.035579, lng: -93.242206 },
          { lat: 45.035579, lng: -93.242184 },
          { lat: 45.035579, lng: -93.242124 },
          { lat: 45.03558, lng: -93.242031 },
          { lat: 45.03558, lng: -93.241992 },
          { lat: 45.035584, lng: -93.241401 },
          { lat: 45.035584, lng: -93.241333 },
          { lat: 45.035585, lng: -93.240984 },
          { lat: 45.035585, lng: -93.240941 },
          { lat: 45.035586, lng: -93.24067 },
          { lat: 45.035587, lng: -93.240538 },
          { lat: 45.035587, lng: -93.240517 },
          { lat: 45.035593, lng: -93.239632 },
          { lat: 45.035596, lng: -93.238985 },
          { lat: 45.035599, lng: -93.238418 },
          { lat: 45.0356, lng: -93.238258 },
          { lat: 45.0356, lng: -93.238207 },
          { lat: 45.0356, lng: -93.238187 },
          { lat: 45.035601, lng: -93.238004 },
          { lat: 45.035603, lng: -93.237704 },
          { lat: 45.035606, lng: -93.237106 },
          { lat: 45.035622, lng: -93.234734 },
          { lat: 45.035623, lng: -93.234622 },
          { lat: 45.035624, lng: -93.234577 },
          { lat: 45.035626, lng: -93.234317 },
          { lat: 45.035652, lng: -93.230751 },
          { lat: 45.035656, lng: -93.229485 },
          { lat: 45.035666, lng: -93.22832 },
          { lat: 45.035667, lng: -93.22821 },
          { lat: 45.035675, lng: -93.226992 },
          { lat: 45.035671, lng: -93.226929 },
          { lat: 45.033485, lng: -93.226929 },
          { lat: 45.031345, lng: -93.226929 },
          { lat: 45.03133, lng: -93.226929 },
          { lat: 45.029537, lng: -93.226913 },
          { lat: 45.027729, lng: -93.226898 },
          { lat: 45.027714, lng: -93.226898 },
          { lat: 45.025917, lng: -93.226891 },
          { lat: 45.024224, lng: -93.226883 },
          { lat: 45.024097, lng: -93.226883 },
          { lat: 45.022285, lng: -93.226875 },
          { lat: 45.021687, lng: -93.226868 },
          { lat: 45.021515, lng: -93.226872 },
          { lat: 45.020473, lng: -93.226868 },
          { lat: 45.019513, lng: -93.226863 },
          { lat: 45.018921, lng: -93.22686 },
          { lat: 45.016842, lng: -93.226857 },
          { lat: 45.015022, lng: -93.226851 },
          { lat: 45.013214, lng: -93.226845 },
          { lat: 45.013245, lng: -93.226629 },
          { lat: 45.013254, lng: -93.226043 },
          { lat: 45.013264, lng: -93.225831 },
          { lat: 45.01328, lng: -93.225667 },
          { lat: 45.013226, lng: -93.225357 },
          { lat: 45.013237, lng: -93.224174 },
          { lat: 45.013247, lng: -93.222977 },
          { lat: 45.013248, lng: -93.222893 },
          { lat: 45.013252, lng: -93.221657 },
          { lat: 45.013263, lng: -93.220497 },
          { lat: 45.013316, lng: -93.220027 },
          { lat: 45.013347, lng: -93.219758 },
          { lat: 45.01335, lng: -93.219601 },
          { lat: 45.013354, lng: -93.219403 },
          { lat: 45.013356, lng: -93.219043 },
          { lat: 45.013368, lng: -93.218138 },
          { lat: 45.013371, lng: -93.217871 },
          { lat: 45.008783, lng: -93.217749 },
          { lat: 45.006042, lng: -93.217675 },
          { lat: 45.006044, lng: -93.217469 },
          { lat: 45.006047, lng: -93.217259 },
          { lat: 45.006088, lng: -93.213957 },
          { lat: 45.006091, lng: -93.213774 },
          { lat: 45.006094, lng: -93.2135 },
          { lat: 45.006096, lng: -93.213357 },
          { lat: 45.006154, lng: -93.208712 },
          { lat: 45.006165, lng: -93.207846 },
          { lat: 45.006166, lng: -93.207731 },
          { lat: 45.006166, lng: -93.207714 },
          { lat: 45.006205, lng: -93.207636 },
          { lat: 45.005977, lng: -93.207638 },
          { lat: 45.002524, lng: -93.207618 },
          { lat: 45.00073, lng: -93.207608 },
          { lat: 45.000706, lng: -93.207601 },
          { lat: 45.000643, lng: -93.207602 },
          { lat: 45.000572, lng: -93.207603 },
          { lat: 45.000549, lng: -93.207602 },
          { lat: 44.998862, lng: -93.207596 },
          { lat: 44.995566, lng: -93.207577 },
          { lat: 44.991684, lng: -93.207558 },
          { lat: 44.990425, lng: -93.207566 },
          { lat: 44.989504, lng: -93.207574 },
          { lat: 44.988071, lng: -93.207587 },
          { lat: 44.98476, lng: -93.207612 },
          { lat: 44.981165, lng: -93.20764 },
          { lat: 44.980331, lng: -93.207649 },
          { lat: 44.977227, lng: -93.20767 },
          { lat: 44.976754, lng: -93.207673 },
          { lat: 44.976735, lng: -93.207673 },
          { lat: 44.976326, lng: -93.207672 },
          { lat: 44.976023, lng: -93.207675 },
          { lat: 44.97574, lng: -93.207678 },
          { lat: 44.975208, lng: -93.207681 },
          { lat: 44.974919, lng: -93.207683 },
          { lat: 44.974746, lng: -93.207684 },
          { lat: 44.974285, lng: -93.207687 },
          { lat: 44.974162, lng: -93.207687 },
          { lat: 44.973166, lng: -93.207692 },
          { lat: 44.972583, lng: -93.207695 },
          { lat: 44.971587, lng: -93.207702 },
          { lat: 44.971498, lng: -93.207693 },
          { lat: 44.971402, lng: -93.207696 },
          { lat: 44.971233, lng: -93.207704 },
          { lat: 44.970023, lng: -93.207711 },
          { lat: 44.969604, lng: -93.207713 },
          { lat: 44.96944, lng: -93.207714 },
          { lat: 44.96801, lng: -93.207726 },
          { lat: 44.966423, lng: -93.207733 },
          { lat: 44.964607, lng: -93.207741 },
          { lat: 44.962807, lng: -93.207756 },
          { lat: 44.96059, lng: -93.207762 },
          { lat: 44.960333, lng: -93.207763 },
          { lat: 44.960117, lng: -93.207764 },
          { lat: 44.960068, lng: -93.207768 },
          { lat: 44.960034, lng: -93.20777 },
          { lat: 44.960006, lng: -93.20777 },
          { lat: 44.959973, lng: -93.20777 },
          { lat: 44.959904, lng: -93.20777 },
          { lat: 44.959793, lng: -93.20777 },
          { lat: 44.959762, lng: -93.20777 },
          { lat: 44.959693, lng: -93.20777 },
          { lat: 44.959664, lng: -93.20777 },
          { lat: 44.959632, lng: -93.20777 },
          { lat: 44.959028, lng: -93.207769 },
          { lat: 44.958743, lng: -93.207777 },
          { lat: 44.958572, lng: -93.207771 },
          { lat: 44.958426, lng: -93.207768 },
          { lat: 44.957312, lng: -93.207766 },
          { lat: 44.956402, lng: -93.207787 },
          { lat: 44.956085, lng: -93.207782 },
          { lat: 44.955383, lng: -93.207771 },
          { lat: 44.955227, lng: -93.207771 },
          { lat: 44.954933, lng: -93.207764 },
          { lat: 44.954762, lng: -93.207762 },
          { lat: 44.954308, lng: -93.207761 },
          { lat: 44.953263, lng: -93.207759 },
          { lat: 44.953209, lng: -93.207757 },
          { lat: 44.953056, lng: -93.207751 },
          { lat: 44.952963, lng: -93.207518 },
          { lat: 44.95272, lng: -93.206912 },
          { lat: 44.951962, lng: -93.205018 },
          { lat: 44.951491, lng: -93.204708 },
          { lat: 44.949933, lng: -93.203684 },
          { lat: 44.948421, lng: -93.20269 },
          { lat: 44.948375, lng: -93.20266 },
          { lat: 44.94485, lng: -93.20152 },
          { lat: 44.941504, lng: -93.200451 },
          { lat: 44.93753, lng: -93.200639 },
          { lat: 44.937379, lng: -93.200646 },
          { lat: 44.934301, lng: -93.200791 },
          { lat: 44.93413, lng: -93.200767 },
          { lat: 44.930709, lng: -93.200296 },
          { lat: 44.930645, lng: -93.200287 },
          { lat: 44.930391, lng: -93.200252 },
          { lat: 44.927033, lng: -93.199789 },
          { lat: 44.926929, lng: -93.199811 },
          { lat: 44.926751, lng: -93.199849 },
          { lat: 44.925503, lng: -93.200119 },
          { lat: 44.924077, lng: -93.200427 },
          { lat: 44.919764, lng: -93.201359 },
          { lat: 44.919243, lng: -93.201319 },
          { lat: 44.917803, lng: -93.201207 },
          { lat: 44.915461, lng: -93.201026 },
          { lat: 44.915235, lng: -93.201009 },
          { lat: 44.914907, lng: -93.200984 },
          { lat: 44.91446, lng: -93.200949 },
          { lat: 44.914306, lng: -93.200937 },
          { lat: 44.914169, lng: -93.200926 },
          { lat: 44.913857, lng: -93.200885 },
          { lat: 44.912422, lng: -93.200791 },
          { lat: 44.911593, lng: -93.200727 },
          { lat: 44.910764, lng: -93.200663 },
          { lat: 44.91028, lng: -93.200624 },
          { lat: 44.909797, lng: -93.200584 },
          { lat: 44.9092, lng: -93.200426 },
          { lat: 44.908934, lng: -93.200334 },
          { lat: 44.908665, lng: -93.200138 },
          { lat: 44.908613, lng: -93.200049 },
          { lat: 44.90856, lng: -93.199959 },
          { lat: 44.908313, lng: -93.199493 },
          { lat: 44.908066, lng: -93.199027 },
          { lat: 44.907264, lng: -93.197515 },
          { lat: 44.906463, lng: -93.196003 },
          { lat: 44.906018, lng: -93.195163 },
          { lat: 44.905857, lng: -93.194859 },
          { lat: 44.905572, lng: -93.194322 },
          { lat: 44.905414, lng: -93.194023 },
          { lat: 44.905415, lng: -93.194697 },
          { lat: 44.905415, lng: -93.197879 },
          { lat: 44.905409, lng: -93.198449 },
          { lat: 44.905408, lng: -93.198595 },
          { lat: 44.905396, lng: -93.199135 },
          { lat: 44.905396, lng: -93.199357 },
          { lat: 44.905398, lng: -93.20007 },
          { lat: 44.905407, lng: -93.202492 },
          { lat: 44.905405, lng: -93.203331 },
          { lat: 44.905404, lng: -93.203381 },
          { lat: 44.905399, lng: -93.205048 },
          { lat: 44.905398, lng: -93.205625 },
          { lat: 44.905396, lng: -93.206314 },
          { lat: 44.905392, lng: -93.207596 },
          { lat: 44.903591, lng: -93.207619 },
          { lat: 44.901798, lng: -93.207634 },
          { lat: 44.899963, lng: -93.207652 },
          { lat: 44.899279, lng: -93.207658 },
          { lat: 44.898666, lng: -93.207664 },
          { lat: 44.898496, lng: -93.207664 },
          { lat: 44.898354, lng: -93.207667 },
          { lat: 44.898176, lng: -93.207671 },
          { lat: 44.898125, lng: -93.207672 },
          { lat: 44.896317, lng: -93.207687 },
          { lat: 44.896313, lng: -93.208939 },
          { lat: 44.896314, lng: -93.210205 },
          { lat: 44.896313, lng: -93.210753 },
          { lat: 44.896135, lng: -93.210746 },
          { lat: 44.895587, lng: -93.210739 },
          { lat: 44.895339, lng: -93.210782 },
          { lat: 44.894708, lng: -93.210756 },
          { lat: 44.893695, lng: -93.210875 },
          { lat: 44.893092, lng: -93.210893 },
          { lat: 44.893089, lng: -93.214597 },
          { lat: 44.893086, lng: -93.216266 },
          { lat: 44.893697, lng: -93.217175 },
          { lat: 44.89451, lng: -93.217173 },
          { lat: 44.895525, lng: -93.217174 },
          { lat: 44.896144, lng: -93.217189 },
          { lat: 44.896127, lng: -93.217919 },
          { lat: 44.896128, lng: -93.217998 },
          { lat: 44.896118, lng: -93.219028 },
          { lat: 44.894897, lng: -93.219033 },
          { lat: 44.894897, lng: -93.220372 },
          { lat: 44.896048, lng: -93.222638 },
          { lat: 44.896113, lng: -93.222634 },
          { lat: 44.896821, lng: -93.222588 },
          { lat: 44.896825, lng: -93.221437 },
          { lat: 44.896965, lng: -93.221049 },
          { lat: 44.896965, lng: -93.219774 },
          { lat: 44.896729, lng: -93.219383 },
          { lat: 44.896742, lng: -93.219024 },
          { lat: 44.897903, lng: -93.219018 },
          { lat: 44.89728, lng: -93.220346 },
          { lat: 44.897133, lng: -93.220347 },
          { lat: 44.897152, lng: -93.222961 },
          { lat: 44.897147, lng: -93.223458 },
          { lat: 44.897103, lng: -93.228094 },
          { lat: 44.89687, lng: -93.228097 },
          { lat: 44.896868, lng: -93.229426 },
          { lat: 44.896864, lng: -93.231759 },
          { lat: 44.896271, lng: -93.231766 },
          { lat: 44.89562, lng: -93.231764 },
          { lat: 44.895626, lng: -93.232391 },
          { lat: 44.895138, lng: -93.232399 },
          { lat: 44.895126, lng: -93.233681 },
          { lat: 44.895115, lng: -93.234955 },
          { lat: 44.896091, lng: -93.234947 },
          { lat: 44.896101, lng: -93.233673 },
          { lat: 44.896111, lng: -93.232384 },
          { lat: 44.896263, lng: -93.232384 },
          { lat: 44.896869, lng: -93.23238 },
          { lat: 44.896857, lng: -93.232543 },
          { lat: 44.896883, lng: -93.233607 },
          { lat: 44.896892, lng: -93.234387 },
          { lat: 44.896904, lng: -93.235396 },
          { lat: 44.896928, lng: -93.237457 },
          { lat: 44.896953, lng: -93.23747 },
          { lat: 44.896974, lng: -93.238676 },
          { lat: 44.896935, lng: -93.239979 },
          { lat: 44.896973, lng: -93.240678 },
          { lat: 44.897005, lng: -93.241282 },
          { lat: 44.897133, lng: -93.24128 },
          { lat: 44.897138, lng: -93.241859 },
          { lat: 44.896994, lng: -93.241861 },
          { lat: 44.897, lng: -93.242531 },
          { lat: 44.897144, lng: -93.242531 },
          { lat: 44.897676, lng: -93.242531 },
          { lat: 44.89768, lng: -93.24323 },
          { lat: 44.897338, lng: -93.243235 },
          { lat: 44.897339, lng: -93.243806 },
          { lat: 44.897079, lng: -93.243813 },
          { lat: 44.897078, lng: -93.244514 },
          { lat: 44.897235, lng: -93.244503 },
          { lat: 44.897241, lng: -93.245054 },
          { lat: 44.897072, lng: -93.245056 },
          { lat: 44.896613, lng: -93.245071 },
          { lat: 44.89616, lng: -93.24501 },
          { lat: 44.895992, lng: -93.244988 },
          { lat: 44.896011, lng: -93.245775 },
          { lat: 44.89602, lng: -93.246139 },
          { lat: 44.896014, lng: -93.247144 },
          { lat: 44.896202, lng: -93.247157 },
          { lat: 44.89698, lng: -93.247176 },
          { lat: 44.897643, lng: -93.247161 },
          { lat: 44.897641, lng: -93.247363 },
          { lat: 44.89764, lng: -93.247604 },
          { lat: 44.897641, lng: -93.247748 },
          { lat: 44.897648, lng: -93.248323 },
          { lat: 44.897945, lng: -93.248314 },
          { lat: 44.897937, lng: -93.251416 },
          { lat: 44.897934, lng: -93.252678 },
          { lat: 44.89793, lng: -93.25396 },
          { lat: 44.89793, lng: -93.254639 },
          { lat: 44.89701, lng: -93.254648 },
          { lat: 44.89701, lng: -93.255251 },
          { lat: 44.895439, lng: -93.255287 },
          { lat: 44.895423, lng: -93.254608 },
          { lat: 44.894329, lng: -93.254646 },
          { lat: 44.894501, lng: -93.254158 },
          { lat: 44.894424, lng: -93.254105 },
          { lat: 44.894341, lng: -93.254066 },
          { lat: 44.894253, lng: -93.254066 },
          { lat: 44.893241, lng: -93.254089 },
          { lat: 44.892872, lng: -93.254097 },
          { lat: 44.892717, lng: -93.254126 },
          { lat: 44.89256, lng: -93.254101 },
          { lat: 44.892525, lng: -93.253593 },
          { lat: 44.892525, lng: -93.252945 },
          { lat: 44.892513, lng: -93.252892 },
          { lat: 44.892483, lng: -93.252846 },
          { lat: 44.892441, lng: -93.252838 },
          { lat: 44.890945, lng: -93.252892 },
          { lat: 44.890717, lng: -93.252899 },
          { lat: 44.890713, lng: -93.252962 },
          { lat: 44.890713, lng: -93.25412 },
          { lat: 44.890713, lng: -93.254181 },
          { lat: 44.890713, lng: -93.255463 },
          { lat: 44.890716, lng: -93.255516 },
          { lat: 44.890707, lng: -93.256764 },
          { lat: 44.890715, lng: -93.257167 },
          { lat: 44.890615, lng: -93.257547 },
          { lat: 44.890539, lng: -93.257943 },
          { lat: 44.890481, lng: -93.258364 },
          { lat: 44.890449, lng: -93.258802 },
          { lat: 44.890437, lng: -93.259238 },
          { lat: 44.890518, lng: -93.261689 },
          { lat: 44.890609, lng: -93.264112 },
          { lat: 44.890637, lng: -93.264834 },
          { lat: 44.890643, lng: -93.265372 },
          { lat: 44.890644, lng: -93.265606 },
          { lat: 44.890634, lng: -93.266741 },
          { lat: 44.890625, lng: -93.267831 },
          { lat: 44.890638, lng: -93.268167 },
          { lat: 44.890622, lng: -93.26984 },
          { lat: 44.890594, lng: -93.272486 },
          { lat: 44.890567, lng: -93.274054 },
          { lat: 44.890569, lng: -93.27442 },
          { lat: 44.890564, lng: -93.275119 },
          { lat: 44.890554, lng: -93.276824 },
          { lat: 44.890439, lng: -93.277054 },
          { lat: 44.890347, lng: -93.277301 },
          { lat: 44.890267, lng: -93.277563 },
          { lat: 44.890204, lng: -93.277831 },
          { lat: 44.890164, lng: -93.278108 },
          { lat: 44.890116, lng: -93.278381 },
          { lat: 44.890067, lng: -93.278722 },
          { lat: 44.890051, lng: -93.279031 },
          { lat: 44.890036, lng: -93.27952 },
          { lat: 44.890059, lng: -93.28321 },
          { lat: 44.890059, lng: -93.283941 },
          { lat: 44.890083, lng: -93.288353 },
          { lat: 44.890089, lng: -93.288957 },
          { lat: 44.8901, lng: -93.289994 },
          { lat: 44.890063, lng: -93.291523 },
          { lat: 44.890063, lng: -93.291869 },
          { lat: 44.890057, lng: -93.292107 },
          { lat: 44.890031, lng: -93.292344 },
          { lat: 44.889999, lng: -93.292601 },
          { lat: 44.889967, lng: -93.29282 },
          { lat: 44.889896, lng: -93.293224 },
          { lat: 44.889787, lng: -93.293629 },
          { lat: 44.889851, lng: -93.294074 },
          { lat: 44.889904, lng: -93.294442 },
          { lat: 44.88999, lng: -93.295027 },
          { lat: 44.890146, lng: -93.295793 },
          { lat: 44.890171, lng: -93.295966 },
          { lat: 44.890228, lng: -93.296556 },
          { lat: 44.890272, lng: -93.296953 },
          { lat: 44.890305, lng: -93.297323 },
          { lat: 44.890327, lng: -93.297797 },
          { lat: 44.890337, lng: -93.29833 },
          { lat: 44.890384, lng: -93.299615 },
          { lat: 44.890596, lng: -93.30505 },
          { lat: 44.890605, lng: -93.305356 },
          { lat: 44.890644, lng: -93.306595 },
          { lat: 44.890619, lng: -93.307941 },
          { lat: 44.890605, lng: -93.308661 },
          { lat: 44.890618, lng: -93.308981 },
          { lat: 44.890715, lng: -93.312353 },
          { lat: 44.890715, lng: -93.313751 },
          { lat: 44.890738, lng: -93.315835 },
          { lat: 44.89076, lng: -93.318093 },
          { lat: 44.890752, lng: -93.318825 },
          { lat: 44.890854, lng: -93.318825 },
          { lat: 44.891064, lng: -93.318825 },
          { lat: 44.89116, lng: -93.318825 },
          { lat: 44.892601, lng: -93.318825 },
          { lat: 44.894398, lng: -93.318825 },
          { lat: 44.896202, lng: -93.318829 },
          { lat: 44.897999, lng: -93.318832 },
          { lat: 44.899818, lng: -93.318825 },
          { lat: 44.900283, lng: -93.318825 },
          { lat: 44.901619, lng: -93.318825 },
          { lat: 44.903427, lng: -93.318825 },
          { lat: 44.90345, lng: -93.318825 },
          { lat: 44.905239, lng: -93.318817 },
          { lat: 44.905247, lng: -93.320045 },
          { lat: 44.905247, lng: -93.320114 },
          { lat: 44.90525, lng: -93.320601 },
          { lat: 44.905252, lng: -93.320811 },
          { lat: 44.905256, lng: -93.321358 },
          { lat: 44.905256, lng: -93.321389 },
          { lat: 44.905262, lng: -93.322624 },
          { lat: 44.905263, lng: -93.322647 },
          { lat: 44.905273, lng: -93.323914 },
          { lat: 44.905281, lng: -93.325172 },
          { lat: 44.905291, lng: -93.326454 },
          { lat: 44.905299, lng: -93.327705 },
          { lat: 44.905308, lng: -93.328995 },
          { lat: 44.905385, lng: -93.328995 },
          { lat: 44.907112, lng: -93.32901 },
          { lat: 44.908905, lng: -93.329018 },
          { lat: 44.908924, lng: -93.329018 },
          { lat: 44.910702, lng: -93.329025 },
          { lat: 44.910725, lng: -93.329025 },
          { lat: 44.912529, lng: -93.329033 },
          { lat: 44.913452, lng: -93.329048 },
          { lat: 44.91433, lng: -93.329056 },
          { lat: 44.916126, lng: -93.329071 },
          { lat: 44.917915, lng: -93.329094 },
          { lat: 44.91972, lng: -93.329109 },
          { lat: 44.920849, lng: -93.329104 },
          { lat: 44.921532, lng: -93.329102 },
          { lat: 44.921936, lng: -93.329102 },
          { lat: 44.921992, lng: -93.329102 },
          { lat: 44.922543, lng: -93.329102 },
          { lat: 44.922634, lng: -93.3291 },
          { lat: 44.923378, lng: -93.329097 },
          { lat: 44.923668, lng: -93.329096 },
          { lat: 44.924949, lng: -93.329092 },
          { lat: 44.925076, lng: -93.329092 },
          { lat: 44.926937, lng: -93.329086 },
          { lat: 44.928753, lng: -93.329071 },
          { lat: 44.929029, lng: -93.329068 },
          { lat: 44.930557, lng: -93.329056 },
          { lat: 44.930587, lng: -93.329056 },
          { lat: 44.932362, lng: -93.329041 },
          { lat: 44.934063, lng: -93.329025 },
          { lat: 44.93417, lng: -93.329025 },
          { lat: 44.935989, lng: -93.329018 },
          { lat: 44.939392, lng: -93.329005 },
          { lat: 44.939824, lng: -93.329004 },
          { lat: 44.940428, lng: -93.329112 },
          { lat: 44.940591, lng: -93.329139 },
          { lat: 44.940685, lng: -93.329155 },
          { lat: 44.941422, lng: -93.329163 }
        ],
      ];
      return (
        <div>
        {showWelcome && user && (
          <div
            className="welcome-message"
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '9999',
              color: '#fff',
              textAlign: 'center',
              padding: '20px',
              cursor: 'pointer',
            }}
            onClick={handleDismissWelcome}
          >
    <div className="welcome-message-content">
      <h2>Welcome to Heyday, {user.username}!</h2>
      <p>Head over to the getting started page for a quick tutorial!</p>
      <p>(Click anywhere to exit)</p>
    </div>
          </div>
        )}

<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",  
    marginBottom: "10px",
    marginTop: "50px"
  }}
>
  <Button
  className="currentloc"
    variant="contained"
    onClick={handleGetCurrentLocation}
    sx={{
      backgroundColor: "#057",
      "&:hover": {
        backgroundColor: "#046",
      },
    }}
  >
    Use Current Location
  </Button>
  <Button
    className="wildcard"
    variant="contained"
    onClick={handleRandomButton}
    sx={{
      backgroundColor: "#057",
      "&:hover": {
        backgroundColor: "#046",
      },
    }}
  >
    WildCard
  </Button>
</Box>
          <Wrapper
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={["places", "marker"]}
            render={renderStatus}
          >
            <GoogleMapComponent
              center={currentLocation || { lat: 44.9778, lng: -93.2650 }}
              zoom={15}
              boundaries={boundaries}
              currentLocation={currentLocation}
              markers={filteredData}
            />
          </Wrapper>
          <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-140px', 
        }}
      >
        <Buttons onFilterChange={handleFilterChange} />
      </Box>
          <UserNavBar />
        </div>
      );
    };
  
    return (
      <div>
        <MapWrapper />
      </div>
    );
  }
  
export default UserLanding;
