import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../slice/user.slice.js";
import { optionReducer } from "../slice/option.slice.js";

export const store = configureStore({
    reducer: {
        user: userReducer,
        option: optionReducer,
    },
});
