import { createSlice } from "@reduxjs/toolkit";

const filterProductString  = localStorage.getItem('filter_product');
const filterId = filterProductString ? JSON.parse(filterProductString) : 1;

const filterProductSlice = createSlice({
    name: 'filterProduct',
    initialState: {
        idFilterProduct: filterId,
    },

    reducers: {
        filterIdProduct: (state, action) => {            
            state.idFilterProduct = action.payload
            localStorage.setItem('filter_product', JSON.stringify(state.idFilterProduct))
        }
    }
})

export const { filterIdProduct } = filterProductSlice.actions;
export default filterProductSlice.reducer