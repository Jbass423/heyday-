
const favorites = (state = [], action) => {
    switch (action.type) {
      case "SET_FAVS_SUCCESS":
        return action.payload; 
      case "ADD_FAV_SUCCESS":
      console.log("Reducer received ADD_FAV_SUCCESS with payload:", action.payload);
        return [...state, action.payload]; 
       case "DELETE_FAVS_SUCESS":
         return state.filter(fav => fav.id !== action.payload.id) 
      default:
        return state;
    }
  };
  
  export default favorites;
  