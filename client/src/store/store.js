import { createStore, combineReducers, applyMiddlewar, compose } from 'redux';
import currentGameReducer from './reducers/currentGameReducer';
import waitingRoomReducer from './reducers/waitingRoomReducer';
import isLoginReducer from './reducers/isLoginReducer';
import selectedRoom from './reducers/selectedRoom';

import axios from 'axios';
// import axiosMiddleware from 'redux-axios-middleware';

const client = axios.create({
  baseURL: 'http://3.35.27.36:3001',
  responseType: 'json',
});

const rootReducer = combineReducers({
  login: isLoginReducer,
  currentGame: currentGameReducer,
  waitingRoom: waitingRoomReducer,
  selectedRoom: selectedRoom,
});

export default createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
