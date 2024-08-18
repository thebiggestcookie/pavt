import {
  FETCH_ATTRIBUTES_REQUEST,
  FETCH_ATTRIBUTES_SUCCESS,
  FETCH_ATTRIBUTES_FAILURE
} from '../actions/attributeActions';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const attributeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ATTRIBUTES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_ATTRIBUTES_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload
      };
    case FETCH_ATTRIBUTES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default attributeReducer;
