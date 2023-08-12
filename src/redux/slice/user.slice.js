import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: JSON.parse(localStorage.getItem("user") || "null") || null,
    reducers: {
        updateUser: (state, action) => {
            const newState = {
                ...state,
                ...action.payload,
            };
            const jsonState = JSON.stringify(newState);
            localStorage.setItem("user", jsonState);
            return newState;
        },
        removeUser: () => {
            localStorage.removeItem("user");
        },
    },
});

export const { updateUser, removeUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
