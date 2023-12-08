import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UsersSlice";

//----------- Creating a store to handle all the states of the app
const Store = configureStore({
    reducer : {
        user : UserSlice
    }
})

export default Store;