import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import BusinessNavBar from '../BusinessNavBar/BusinessNavBar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Paper, Box } from '@mui/material';
import "./BusinessLanding.css";

const SubmitButton = styled(Button)({
  backgroundColor: "#057",
  color: "#fff",
  '&:hover': {
    backgroundColor: "#046",
  },
  padding: "10px 20px",
  borderRadius: "5px",
  fontSize: "1em",
  cursor: "pointer",
  width: "100%",
  marginTop: "10px",
});

const ScrollableContent = styled(Box)({
  height: 'calc(100vh - 100px)', 
  overflowY: 'auto',
  padding: '20px',
  '&::-webkit-scrollbar': {
    width: '10px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '5px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
});

const InputContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '20px',
});

const CustomDialogPaper = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '-10%', 
  left: '35%',
  transform: 'translate(-50%, 0)', 
  width: '80%',
  maxWidth: '600px',
}));



function BusinessLanding() {
  const [getHappy, setHappy] = useState('');
  const [getAddress, setAddress] = useState('');
  const [getName, setName] = useState('');
  const [happyHourTime, setHappyHourTime] = useState('');
  const [happyEndTime, setHappyEndTime] = useState('');
  const [happyHourDate, setHappyHourDate] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const business = useSelector(store => store.business);
  const user = useSelector(store => store.user);
  const happy = useSelector(store => store.happy);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch({ type: "SET_BUS" });
    dispatch({ type: "SET_HAPPY" });
  }, [dispatch]);
  
  const busFilter = (business || []).filter(bus => bus && bus.user_id && Number(bus.user_id) === Number(user.id));
  const happyFilter = (happy || []).filter(hap => hap && hap.user_id && Number(hap.user_id) === Number(user.id));
  
  const handleHappy = (event) => {
    event.preventDefault();
    if (!selectedBusinessId) {
      console.error('No business selected');
      return;
    }
    console.log("Selected Business ID: ", selectedBusinessId);
    dispatch({
      type: 'ADD_HAPPY',
      payload: {
        user_id: user.id,
        business_id: selectedBusinessId,
        address: getAddress,
        description: getHappy,
        date: happyHourDate,
        start_time: happyHourTime,
        end_time: happyEndTime,
        name: getName,
      },
    });
    dispatch({ type: 'SET_HAPPY' });
    
    setHappy('');
    setName('');
    setAddress('');
    setHappyHourTime('');
    setHappyHourDate('');
    setHappyEndTime('');
    setSelectedBusinessId('');
    
    setModalMessage('Happy Hour added successfully!');
    setOpenModal(true);
  };
  
  const handleDel = (id) => {
    dispatch({ type: "DELETE_HAPPY", payload: { id } });
    dispatch({ type: 'SET_HAPPY' });
  };
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };
  
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <ScrollableContent>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', opacity: 0 }}>

        </div>
        <div>
          <center>
            <h1 className='busland'>Welcome {user.username}</h1>
          </center>
          <h2 className='buslandtwo'>
            {busFilter.map((bus) => (
              <p key={bus.id}>
                <center>Business Name:<p></p>{bus.business_name}</center>
              </p>
            ))}
          </h2>
          <InputContainer>
            <select
              className="select-input"
              value={selectedBusinessId}
              onChange={(event) => setSelectedBusinessId(event.target.value)}
            >
              <option value="" disabled>Select Business</option>
              {busFilter.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.business_name}
                </option>
              ))}
            </select>
            <input
              className="text-input"
              type="text"
              value={getName}
              onChange={(event) => setName(event.target.value)}
              placeholder='Happy Hour Name'
            />
            <input
              className="text-input"
              type="text"
              value={getAddress}
              onChange={(event) => setAddress(event.target.value)}
              placeholder='Address of Happy Hour'
            />
            <input
              className="text-input"
              type="text"
              value={getHappy}
              onChange={(event) => setHappy(event.target.value)}
              placeholder="Enter description"
            />
            <input
              className="date-input"
              type="date"
              value={happyHourDate}
              onChange={(event) => setHappyHourDate(event.target.value)}
            />
            <input
              className="time-input"
              type="time"
              value={happyHourTime}
              onChange={(event) => setHappyHourTime(event.target.value)}
            />
            <input
              className="time-input"
              type="time"
              value={happyEndTime}
              onChange={(event) => setHappyEndTime(event.target.value)}
            />
            <SubmitButton onClick={handleHappy}>SUBMIT</SubmitButton>
          </InputContainer>
        </div>
        <Grid container spacing={4} justifyContent="center">
          {happyFilter.map((hap) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={hap.id}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  sx={{ height: 200 }}
                  image="/image.png"
                  title={hap.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {hap.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description: {hap.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {formatDate(hap.date)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start Time: {hap.start_time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    End Time: {hap.end_time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Address: {hap.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Likes: {hap.likes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    People Interested: {hap.interested}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleDel(hap.id)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </ScrollableContent>
      <footer>
        <div className="buslandingbar">
          <BusinessNavBar />
        </div>
      </footer>

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} PaperComponent={CustomDialogPaper}>
        <DialogTitle>
          Confirmation
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModal}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {modalMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BusinessLanding;