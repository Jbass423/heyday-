import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield axios.get('/api/user', config);
    
    // If the request is successful, dispatch SET_USER
    yield put({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
    
    // If there's an error, dispatch LOGIN_FAILED
    yield put({ type: 'LOGIN_FAILED' });
  }
}


function* updateAccessLevel(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield axios.put('/api/user/access_level', { access_level: 2 }, config);
    yield put({ type: 'UPDATE_USER_SUCCSESS', payload: response.data }); // Assuming the response contains the updated user info
  } catch (error) {
    console.log('User update access level request failed', error);
  }
}


function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('UPDATE_USER', updateAccessLevel)
}

export default userSaga;
