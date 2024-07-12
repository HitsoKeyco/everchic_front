import { createSlice } from "@reduxjs/toolkit";



// Obtener el usuario guardado en localStorage
const userString  = localStorage.getItem('user');
const user = userString ? JSON.parse(userString) : {};

// Obtener el token guardado en localStorage
const tokenString  = localStorage.getItem('token');
const token = tokenString

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: user,
        token: token,
        theme: 'lightTheme',
    },
    reducers: {
        setUser: (state, action) => {
            const data = action.payload;
            state.user = data.user;
            state.token = data.token;
        },
        setTheme: (state, action) => {           
            state.theme = action.payload;
        },
        setUpdateDataUser: (state, action) => {
            state.user = action.payload   
        },
    }})




export const { setUser, setTheme, setUpdateDataUser } = userSlice.actions;

export default userSlice.reducer;
