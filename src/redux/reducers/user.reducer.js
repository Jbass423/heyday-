const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'UNSET_USER':
      return null;
    case 'UPDATE_USER_SUCCESS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
// user will be on the redux state at:
// state.user
export default userReducer;
