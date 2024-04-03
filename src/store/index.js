import { configureStore } from "@reduxjs/toolkit";
import cart from './slices/cart.slice'
import filterProduct from './slices/filterProduct.slice'
import user from './slices/user.slice'
export default configureStore({
    reducer: {
        cart,
        filterProduct,
        user,
    }
})