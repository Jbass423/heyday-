import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';

function* registerBusiness(action) {
  try {
    yield put({ type: 'CLEAR_REGISTRATION_ERROR' });

    // Use a different endpoint for business registration
    const response = yield call(axios.post, '/api/user/register/business', action.payload);

    // Set the user with access_level 2
    yield put({ 
      type: 'SET_USER', 
      payload: { ...response.data, access_level: '2' }
    });

    // Redirect to business info page
    yield put({ type: 'REDIRECT', payload: '/businessinfo' });

  } catch (error) {
    console.log('Error with business registration:', error);
    yield put({ type: 'REGISTRATION_FAILED' });
  }
}

function* businessRegistrationSaga() {
  yield takeLatest('REGISTER_BUSINESS', registerBusiness);
}

export default businessRegistrationSaga;