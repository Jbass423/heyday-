import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { format } from 'date-fns';
import UserNavBar from "../UserNavBar/UserNavBar";
import "./HappyMapping.css";
import RecommendIcon from '@mui/icons-material/Recommend';
import TheRippleEffect from '../TheRippleEffect/TheRippleEffect';

const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return format(date, 'MMM dd, yyyy');
};

const getColor = (value) => {
    const lightBlue = { r: 3, g: 216, b: 230 };
    const dodgerBlue = { r: 0, g: 144, b: 255 };
  
    const interpolate = (start, end, factor) => {
      return Math.round(start + (end - start) * factor);
    };
  
    const factor = value / 100;
    const red = interpolate(dodgerBlue.r, lightBlue.r, factor);
    const green = interpolate(dodgerBlue.g, lightBlue.g, factor);
    const blue = interpolate(dodgerBlue.b, lightBlue.b, factor);
  
    return `rgb(${red},${green},${blue})`;
};

const getRandomFutureDate = () => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
  return futureDate.toISOString().split('T')[0]; // Return in 'YYYY-MM-DD' format
};

const generateRandomSpecials = () => {
  const drinks = ['wells', 'taps', 'margaritas', 'wine', 'shots', 'cocktails'];
  const prices = [2, 3, 4, 5];
  const special1 = `$${prices[Math.floor(Math.random() * prices.length)]} ${drinks[Math.floor(Math.random() * drinks.length)]}`;
  const special2 = `$${prices[Math.floor(Math.random() * prices.length)]} ${drinks[Math.floor(Math.random() * drinks.length)]}`;
  return `${special1} and ${special2}`;
};

const HappyMapping = () => {
    const happy = useSelector(store => store.happy);
    const businesses = useSelector(store => store.business);
    const dispatch = useDispatch();
    const [randomData, setRandomData] = useState({});

    useEffect(() => {
        dispatch({ type: "SET_HAPPY" });
        dispatch({ type: "SET_BUS" });
    }, [dispatch]);

    useEffect(() => {
        // Load or generate random data
        let storedData = localStorage.getItem('happyRandomData');
        if (storedData) {
            setRandomData(JSON.parse(storedData));
        } else {
            const newRandomData = {};
            happy.forEach(item => {
                newRandomData[item.id] = {
                    randomDate: getRandomFutureDate(),
                    randomSpecials: generateRandomSpecials()
                };
            });
            setRandomData(newRandomData);
            localStorage.setItem('happyRandomData', JSON.stringify(newRandomData));
        }
    }, [happy]);

    const handleLike = (event, id, currentLikeStatus) => {
        event.preventDefault();
        dispatch({ type: currentLikeStatus ? "UNLIKE" : "UPDATE_LIKE", payload: { id } });
    };

    const handleInt = (event, id, currentIntStatus) => {
        event.preventDefault();
        dispatch({ 
            type: currentIntStatus ? "UNINTERESTED" : "UPDATE_INT", 
            payload: { id, increment: currentIntStatus + 1 } 
        });
    };

    const findBusinessName = (businessId) => {
        const business = businesses.find(bus => bus.id === businessId);
        return business ? business.business_name : 'Unknown Business';
    };

    // Sort the happy array by id to maintain consistent order
    const sortedHappy = [...happy].sort((a, b) => a.id - b.id);

    return (
        <>
            <TheRippleEffect/>
            <center><Typography className="textbox" variant="h5" gutterBottom>The Heystack</Typography></center> 
            <Box className="scrollable-card-content" component="section" sx={{ p: 2 }}>
                {sortedHappy.map((item) => {
                    const progressInt = Math.min(100, (item.interested / 100) * 100);
                    const progressLike = Math.min(100, (item.likes / 100) * 100);
                    const itemRandomData = randomData[item.id] || {};
                    return (
                        <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                            <Typography variant="h5" component="div">
                                    {findBusinessName(item.business_id)}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {item.name}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    {formatDate(itemRandomData.randomDate || new Date())}
                                </Typography>
                                <Typography variant="h5" component="div">
                                   Location: Minneapolis {item.address}
                                </Typography>
                                <Typography variant="h5" component="div">
                                  Start Time: {new Date(`1970-01-01T${item.start_time}`).toLocaleTimeString('en-US', 
                                    { hour: 'numeric', minute: '2-digit', hour12: true }
                                  )}
                                </Typography>
                                <Typography variant="h5" component="div">
                                  End Time: {new Date(`1970-01-01T${item.end_time}`).toLocaleTimeString('en-US', 
                                    { hour: 'numeric', minute: '2-digit', hour12: true }
                                  )}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Specials: {itemRandomData.randomSpecials || 'No specials available'}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={(event) => handleLike(event, item.id, item.userLiked)}
                                    >
                                        {item.userLiked ? 'Unlike' : <RecommendIcon />}
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={(event) => handleInt(event, item.id, item.userInterested)}
                                    >
                                        {item.userInterested ? 'Not Going' : 'Are you going?'}
                                    </Button>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        # Going:
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={progressInt}
                                        sx={{ 
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: getColor(progressInt),
                                            },
                                        }} 
                                    />
                                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                                    <span>{parseInt(item.interested, 10) || 0} Interested</span>
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        # Likes:
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={progressLike}
                                        sx={{ 
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: getColor(progressLike),
                                            },
                                        }} 
                                    />
                                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                                    <span>{parseInt(item.likes, 10) || 0} Likes</span>
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions>
                            </CardActions>
                        </Card>
                    );
                })}
            </Box>
            <UserNavBar />
        </>
    );
};

export default HappyMapping;