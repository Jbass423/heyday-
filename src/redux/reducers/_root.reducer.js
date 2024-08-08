import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import historyReducer from './history.reducer'; // new reducers
import favorites from './favorites.reducer'; // new reducers

import happy from './happyHour.reducer';
import business from './business.reducer';

// WORTH REMEMBERING THE WRAPPING OF STATE, THIS ALLOWS YOU TO RESET STATE 
// ENTIRELY AND GET A CLEAN SLATE!!!

const appReducer = combineReducers({
  errors,
  user,
  historyReducer,
  favorites,
  business,
  happy,
});

// WORTH REMEMBERING THE WRAPPING OF STATE, THIS ALLOWS YOU TO RESET STATE 
// ENTIRELY AND GET A CLEAN SLATE!!!

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
// new reducers added to the rootReducer and combined 

const rootReducer = (state, action) => {
  if (action.type === 'RESET_STATE') {
    // Reset state to initial values
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
