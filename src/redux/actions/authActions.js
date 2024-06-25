import axios from 'axios';

export const loginUser = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, { email, password });
    const { authToken } = response.data;
    localStorage.setItem('authToken', authToken);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: authToken,
    });
    dispatch(authenticateUser());
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAIL',
      payload: error.response.data,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('authToken');
  dispatch({
    type: 'LOGOUT',
  });
};

export const authenticateUser = () => async (dispatch) => {
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const user = response.data;
      dispatch({
        type: 'AUTHENTICATE_SUCCESS',
        payload: user,
      });
    } catch (error) {
      dispatch({
        type: 'AUTHENTICATE_FAIL',
      });
    }
  } else {
    dispatch({
      type: 'AUTHENTICATE_FAIL',
    });
  }
};
