import { createSlice } from "@reduxjs/toolkit";

// Funciones utilitarias para manejar localStorage
const storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },    
    setChangeTheme: (key, value) => {
        localStorage.setItem(key, value);
    },
};

// Inicialización del estado desde localStorage
const initialState = {
    data: storage.get("user") || {},
    token: storage.get("token") || null,
    theme: storage.get("theme") || 'darkTheme',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { user, token } = action.payload;
        
            // Actualizar localStorage
            storage.set("user", user);
            storage.set("token", token);

            // Actualizar el estado
            state.data = user;
            state.token = token;
        },
        setTheme: (state, action) => {
            const newTheme = action.payload;

            // Actualizar localStorage
            storage.setChangeTheme("theme", newTheme);

            // Actualizar el estado
            state.theme = newTheme;
        },

        updateUser: (state, action) => {
            const { user } = action.payload;
            storage.set("user", user);
            state.data = user;
        },
    },
});

export const { setUser, setTheme, updateUser } = userSlice.actions;

export default userSlice.reducer;
