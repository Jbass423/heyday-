const redirectReducer = (state = null, action) => {
    switch (action.type) {
      case 'REDIRECT':
        return action.payload;
      case 'CLEAR_REDIRECT':
        return null;
      default:
        return state;
    }
  };
  
  export default redirectReducer;