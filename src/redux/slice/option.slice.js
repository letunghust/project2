import { createSlice } from "@reduxjs/toolkit";

export const optionSlice = createSlice({
    name: "option",
    initialState: JSON.parse(localStorage.getItem("option") || "null") || { remember: true, classId: 0 },
    reducers: {
        rememberUser: (state, action) => {
            const newState = {
                ...state,
                ...action.payload,
            };
            const jsonState = JSON.stringify(newState);
            localStorage.setItem("option", jsonState);
            return newState;
        },
        rememberClass: (state, action) => {
            const newState = {
                ...state,
                ...action.payload,
            };
            const jsonState = JSON.stringify(newState);
            localStorage.setItem("option", jsonState);
            return newState;
        },
    },
});

export const { rememberUser, rememberClass } = optionSlice.actions;

export const optionReducer = optionSlice.reducer;
