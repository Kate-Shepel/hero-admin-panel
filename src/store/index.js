import { configureStore } from '@reduxjs/toolkit';
import heroes from '../components/heroesList/heroesSlice';
import filters from '../components/heroesFilters/filtersSlice';

const stringMiddleware = (store) => (next) => (action) => {  //next means dispatch
  if(typeof action === 'string') {
    return next({
      type: action
    })
  }
  return next(action)
};

const store = configureStore({
  reducer: {heroes, filters},
  middleWare: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
})

// const store = createStore(
//                     combineReducers({heroes, filters}),// = {heroes: heroes, filters: filters}
//                     compose(
//                       applyMiddleware(thunk, stringMiddleware),
//                       window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//                     )
//                   );

export default store;
