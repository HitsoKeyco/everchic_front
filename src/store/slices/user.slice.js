import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios'; // Importa axios


const userString  = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : {};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: user
    },
    reducers: {
        setUser: (state, action) => action.payload
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
