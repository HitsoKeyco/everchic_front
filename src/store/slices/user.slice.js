import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("userData")) || { token: null, user: {}};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: user,        
        userTheme: 'darkTheme',
    },
    reducers: {
        setUser: (state, action) => {
            const data = action.payload;            
            state.userData = data ;
            
        },
        setUpdateUser: (state, action) => {
            const data = action.payload
            const userLS = JSON.parse(localStorage.getItem("userData")) || { token: false , user: {}};
            userLS.user =  data 
            state.userData = userLS
            localStorage.setItem("userData", JSON.stringify(userLS));
        },       
        setTheme: (state, action) => {           
            state.theme = action.payload;
        },
        setresponseCartUserUpdate: (state, action) => {
            const responseCartUserUpdate = action.payload;            
            state.userData = {
                ...state.userData,  
                user: responseCartUserUpdate,  
            };
        },        
    }
});

export const { setUser, setUpdateUser ,setTheme, setresponseCartUserUpdate } = userSlice.actions;

export default userSlice.reducer;
