const initialState = {
    isLoggedIn: false,
    isLoading: true,
    user: null,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isLoggedIn: true,
                isLoading: false,
                error: null,
            };
        case 'LOGIN_FAIL':
            return {
                ...state,
                isLoggedIn: false,
                isLoading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
                isLoading: false,
                user: null,
            };
        case 'AUTHENTICATE_SUCCESS':
            return {
                ...state,
                isLoggedIn: true,
                isLoading: false,
                user: action.payload,
            };
        case 'AUTHENTICATE_FAIL':
            return {
                ...state,
                isLoggedIn: false,
                isLoading: false,
                user: null,
            };
        default:
            return state;
    }
};

export default authReducer;
