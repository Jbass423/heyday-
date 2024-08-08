import axios from "axios";
import { takeLatest, put, select } from "redux-saga/effects";

function* getHappy() {
    try {
        const response = yield axios.get('/api/happy_hour')
        yield put({ type: "SET_HAPPY_SUCCESS", payload: response.data })
        console.log("checking data in get happy gen saga", response.data)
    } catch (error) {
        console.log("error in happy get gen saga", error);
    }
}

function* addHappy(action) {
    try {
        const response = yield axios.post('/api/happy_hour', action.payload)
        yield put({ type: "ADD_HAPPY_SUCCESS", payload: response.data })
        console.log("checking post data in happy saga gen", response.data);
        yield put({ type: "SET_HAPPY" })
    } catch (error) {
        console.log("error in happy post gen saga", error);
    }
}

function* deleteHappy(action) {
    try {
        console.log("Action received in saga:", action);
        const { id } = action.payload
        console.log("Checking id in saga:", id);
        yield axios.delete(`/api/happy_hour/${id}`)
        yield put({ type: "DELETE_HAPPY_SUCCESS", payload: id })
        yield put({ type: "SET_HAPPY" })
    } catch (error) {
        console.log("failed in delete fav saga ", error)
    }
}

function* updateLike(action) {
    try {
        const { id, increment } = action.payload;
        const response = yield axios.put(`/api/happy_hour/likes/${id}`, { increment });
        console.log('Server response for updateLike:', response.data);
        let likes;
        if (response.data && response.data.rows && response.data.rows.length > 0) {
            likes = parseInt(response.data.rows[0].likes, 10);
        } else if (response.data && response.data.likes) {
            likes = parseInt(response.data.likes, 10);
        } else {
            // If we can't get the updated likes from the response, 
            // we'll fetch the current state and update it
            const currentState = yield select(state => state.happy);
            const currentItem = currentState.find(item => item.id === id);
            likes = parseInt(currentItem.likes, 10) + 1;
        }
        if (isNaN(likes)) {
            throw new Error('Invalid likes value');
        }
        yield put({ 
            type: 'UPDATE_LIKE_SUCCESS', 
            payload: { 
                id, 
                likes, 
                userLiked: increment > 0 
            } 
        });
    } catch (error) {
        console.error('Error updating likes:', error);
        yield put({ type: 'UPDATE_LIKE_FAILURE', error });
    }
}

function* updateInterest(action) {
    try {
        const { id, increment } = action.payload;
        const response = yield axios.put(`/api/happy_hour/interested/${id}`, { increment });
        console.log('Server response for updateInterest:', response.data);
        let interested;
        if (response.data && response.data.rows && response.data.rows.length > 0) {
            interested = parseInt(response.data.rows[0].interested, 10);
        } else if (response.data && response.data.interested) {
            interested = parseInt(response.data.interested, 10);
        } else {
            // If we can't get the updated interested count from the response, 
            // we'll fetch the current state and update it
            const currentState = yield select(state => state.happy);
            const currentItem = currentState.find(item => item.id === id);
            interested = increment ? (parseInt(currentItem.interested, 10) + 1) : (parseInt(currentItem.interested, 10) - 1);
        }
        if (isNaN(interested)) {
            throw new Error('Invalid interested value');
        }
        yield put({ 
            type: 'UPDATE_INT_SUCCESS', 
            payload: { 
                id, 
                interested, 
                userInterested: increment > 0 
            } 
        });
    } catch (error) {
        console.error('Error updating interest:', error);
        yield put({ type: 'UPDATE_INT_FAILURE', error });
    }
}

function* happySaga() {
    yield takeLatest('SET_HAPPY', getHappy);
    yield takeLatest('ADD_HAPPY', addHappy);
    yield takeLatest('DELETE_HAPPY', deleteHappy);
    yield takeLatest('UPDATE_LIKE', updateLike);
    yield takeLatest('UPDATE_INT', updateInterest);
    yield takeLatest('UNLIKE', updateLike);
    yield takeLatest('UNINTERESTED', updateInterest);
}

export default happySaga;