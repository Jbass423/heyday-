import { put, takeLatest, call, take } from 'redux-saga/effects';
import axios from 'axios';
import history from '../../history';

function* loginUser(action) {
  try {
    yield put({ type: 'CLEAR_LOGIN_ERROR' });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield call(axios.post, '/api/user/login', action.payload, config);
    console.log("Full server response:", response.data);

    if (!response.data || typeof response.data.access_level === 'undefined') {
      throw new Error('Invalid server response format');
    }

    yield put({ type: 'SET_USER', payload: response.data });
    yield take('SET_USER_SUCCESS');

    console.log("User after login:", response.data);

    if (response.data.access_level == 1) {
      yield call(history.push, '/user-landing');
    } else {
      throw new Error('Invalid access level for regular login');
    }
  } catch (error) {
    console.log('Error with user login:', error);
    yield put({ type: 'LOGIN_FAILED', payload: error.message });
  }
}

function* loginBusiness(action) {
  try {
    yield put({ type: 'CLEAR_LOGIN_ERROR' });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    const response = yield call(axios.post, '/api/user/login', action.payload, config);
    console.log("Server response:", response.data);

    if (response.data.access_level !== '2') {  // Note: comparing with string '2'
      throw new Error('Invalid access level for business login');
    }

    yield put({ type: 'SET_USER', payload: response.data });

  } catch (error) {
    console.log('Login error:', error);
    yield put({ type: 'LOGIN_FAILED', payload: error.message });
  }
}

function* logoutUser(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    yield call(axios.post, '/api/user/logout', config);
    yield put({ type: 'UNSET_USER' });
    yield call(history.push, '/login');
    yield put({ type: 'RESET_STATE' });
  } catch (error) {
    console.log('Error with user logout:', error);
  }
}

function* setUserSaga(action) {
  yield put({ type: 'SET_USER_SUCCESS' });
}

function* loginSaga() {
  yield takeLatest('LOGIN', loginUser);
  yield takeLatest('LOGIN_BUSINESS', loginBusiness);
  yield takeLatest('LOGOUT', logoutUser);
  yield takeLatest('SET_USER', setUserSaga);
}

export default loginSaga;