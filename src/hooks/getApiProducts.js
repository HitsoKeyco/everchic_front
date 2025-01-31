import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProductStore } from "../store/slices/cart.slice";

const useApiProducts = () => {
    const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;

    const [productsAPI, setProductsAPI] = useState();
    const [isOneProduct, setIsOneProduct] = useState();
    const dispatch = useDispatch();
    const limit = 10; 
    const pagination = { currentPage: 1 }; 

    
    const getProductsAPI = () => {
        axios.get(`${apiUrl}/products?page=${pagination.currentPage}&limit=${limit}`)
            .then(res => {
                setProductsAPI(res.data);
                localStorage.setItem('everchic_stored_products', JSON.stringify(res.data));
                dispatch(addProductStore(res.data))

            })
            .catch(err => {
                console.log(err);
            });
    };

    const getOneProductsAPI = (id) => {
        axios.get(`${apiUrl}/products/${id}`)
            .then(res => {
                setIsOneProduct(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };



    return { productsAPI, getProductsAPI, isOneProduct, getOneProductsAPI };
};

export default useApiProducts;
