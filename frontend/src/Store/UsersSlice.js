import { createSlice } from '@reduxjs/toolkit'

import { DayToValidate, SERVER, Token, setWithExpiry } from '../GlobalFunctions';

//-------------- Create the slice of the users, where we handle all the state respect of the users
const UserSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        isAuthenticated: false
    },
    reducers: {
        //---------- Set the users, i.e. store user detail in state
        //------------------- Login Request Specific Stuff
        loginUserRequest(state) {
            state.loading = true;
        },
        loginUser(state, action) {
            state.loading = false;
            state.success = true;
            state.msg = action.payload.msg;
            // state.isAuthenticated = true;
            state.token = action.payload.token;
        },
        loginUserError(state, action) {
            state.loading = false;
            state.success = false;
            state.msg = action.payload;
        },
        //------------ Login User Specific Stuff-------------------X

        //---------------- Set User Specific Stufff-------------------
        getUserRequest(state) {
            state.loading = true;
        },
        setUser(state, action) {
            state.loading = false;
            state.success = true;
            state.msg = action.payload.msg;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        logoutUser(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
        getUserError(state, action) {
            state.loading = false;
            state.success = false;
            state.token = null;
            state.msg = action.payload;
        },
        //------------- SetUser Specific Stuff----------------X


        //---------------- Register User Specific Stufff-------------------
        registerUserRequest(state) {
            state.loading = true;
        },
        registerUser(state, action) {
            state.loading = false;
            state.success = true;
            state.msg = action.payload;
        },
        registerUserError(state, action) {
            state.loading = false;
            state.success = false;
            state.msg = action.payload;
        },
        //------------- register Specific Stuff----------------X
       

        clearUserError(state) { //Clear all the stuff which is ecncomplish during request or api call
            state.loading = null;
            state.success = null;
            state.msg = null;
        }

    }
});

export const { loginUser, loginUserError, loginUserRequest, clearUserError, setUser, logoutUser, getUserError, getUserRequest, registerUser, registerUserError, registerUserRequest } = UserSlice.actions;


export default UserSlice.reducer;

//------------function ot login the user, during login page
export const handleLoginUser = (formData) => async dispatch => {

    dispatch(loginUserRequest());

    try {
        const url = `${SERVER}/login`;
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        };
        const res = await fetch(url, options);
        const data = await res.json();

        if (data.success === true) {

            setWithExpiry('token', data.token, DayToValidate);

            dispatch(loginUser({ token: data.token, msg: data.msg }));

            if(Token)
                dispatch(getUser());
        }
        else dispatch(loginUserError(data.msg));

    } catch (error) {
        dispatch(loginUserError(error))
    }
}


//-------------- Fetch the user only logged in user by the api --------X
export const getUser = () => async dispatch => {

    dispatch(getUserRequest());

    try {
        const url = `${SERVER}/getUser`;
        const options = {
            headers: {
                'auth-token': Token
            }
        };

        const res = await fetch(url, options);
        const data = await res.json();

        if (data.success === true) {
            dispatch(setUser({ user: data.user }));
            // dispatch(setUser({ user: data.user, msg: data.msg }));
        }
        else dispatch(getUserError(data.msg));

    } catch (error) {
        dispatch(getUserError(error));
    }
};



//---------- Function to submit the form data or can say login the users 
export const handleRegisterUser = (formData) => async dispatch => {

    dispatch(registerUserRequest());

    //-------------Now call the api to register the new user
    try {
        const url = `${SERVER}/register`;
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        };

        const res = await fetch(url, options);
        const data = await res.json();

        if (data.success === true) {
            dispatch(registerUser(data.msg));
        }
        else dispatch(registerUserError(data.msg));

    } catch (error) {
        dispatch(registerUserError(error.response.data.message));
    }
}