import { configureStore } from "@reduxjs/toolkit";
import userslice from "./userSlice";
import infoSlice from "./infoSlice";
const store = configureStore({reducer:{
    user:userslice,
    info:infoSlice
}})

export default store;