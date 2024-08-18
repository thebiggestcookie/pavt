import axios from 'axios';

export const FETCH_ATTRIBUTES_REQUEST = 'FETCH_ATTRIBUTES_REQUEST';
export const FETCH_ATTRIBUTES_SUCCESS = 'FETCH_ATTRIBUTES_SUCCESS';
export const FETCH_ATTRIBUTES_FAILURE = 'FETCH_ATTRIBUTES_FAILURE';

export const fetchAttributes = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ATTRIBUTES_REQUEST });
    try {
      const response = await axios.get('/api/attributes');
      dispatch({
        type: FETCH_ATTRIBUTES_SUCCESS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: FETCH_ATTRIBUTES_FAILURE,
        payload: error.message
      });
    }
  };
};
