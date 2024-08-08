import { all } from 'redux-saga/effects';
import loginSaga from './login.saga';
import registrationSaga from './registration.saga';
import userSaga from './user.saga';
import fetchHistory from './history.saga'; 
import favsSaga from './favorites.saga'; 


import happysaga from './happyHour.saga';

import busSaga from './business.saga.js';
import businessRegistrationSaga from './businessreg.saga.js';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user

// new sagas from above added to rootSaga generator function
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    businessRegistrationSaga(),
    userSaga(),
    fetchHistory(),
    favsSaga(),
    busSaga(),
    happysaga(),
  ]);
}
