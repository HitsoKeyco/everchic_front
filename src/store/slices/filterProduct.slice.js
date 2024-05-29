import { createSlice } from "@reduxjs/toolkit";


// 0 da el valor de all
const value = 'all'
const filterProductSlice = createSlice({
    name: 'filterProduct',
    initialState: {
        idFilterProduct: value,
    },

    reducers: {
        filterIdProduct: (state, action) => {            
            state.idFilterProduct = action.payload            
        }
    }
})

export const { filterIdProduct } = filterProductSlice.actions;
export default filterProductSlice.reducer