import axios from "axios";
import { takeLatest, put } from "redux-saga/effects";

function* getbus(){
    try{
        const response = yield axios.get(`/api/business`);
        console.log("checking data bus gen",response.data );
        yield put({type:'SET_BUS_SUCCESS', payload: response.data})
    } catch(error){
        console.log("error in bus get gen saga", error);
    }
}

    function* addBus(action){
        try{
            const response = yield axios.post(`/api/business`, action.payload)
            yield put({type:'ADD_BUS_SUCCESS', payload: response.data})
        } catch (error){
            console.log("error in saga bus add gen ", error );
        }
    }
  
    function* fetchAllBusinesses() {
        try {
          const response = yield axios.get('/api/business');
          yield put({ type: 'SET_ALL_BUSINESSES', payload: response.data });
        } catch (error) {
          console.log("Error fetching all businesses:", error);
        }
      }
      
 
        function* busSaga (){
            yield takeLatest("SET_BUS", getbus);
            yield takeLatest('ADD_BUS', addBus)
            yield takeLatest('FETCH_ALL_BUSINESSES', fetchAllBusinesses);
    

        }
    

    export default busSaga