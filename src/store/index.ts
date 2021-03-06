import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { RootAction, RootState, ServiceContext } from 'typesafe-actions';

import { composeEnhancers } from './utils';
import rootReducer from './root-reducer';
import rootEpic from './root-epic';
import contextServices from '../services';
import { routerMiddleware } from 'connected-react-router';
import history from '../routes/history';

export const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  ServiceContext
>({
  dependencies: contextServices,
});

// configure middlewares
const middlewares = [routerMiddleware(history), epicMiddleware];

// compose enhancers
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// rehydrate state on app start
const initialState = {};

// create store
const store = createStore(rootReducer, initialState, enhancer);

epicMiddleware.run(rootEpic);

// export store singleton instance
export default store;
