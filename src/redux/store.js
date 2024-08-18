import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import productReducer from './reducers/productReducer';
import attributeReducer from './reducers/attributeReducer';

const rootReducer = combineReducers({
  products: productReducer,
  attributes: attributeReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
