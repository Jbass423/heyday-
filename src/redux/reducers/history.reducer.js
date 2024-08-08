const historyReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_HISTORY_ITEM":
      console.log('History set:', action.payload);
      return action.payload;
    case "ADD_HISTORY":
      return [...state, action.payload]  
      default:
        return state   
  }

}

export default historyReducer;