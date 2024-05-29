import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProductStore } from "../store/slices/cart.slice";

const getApiProducts = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [productsAPI, setProductsAPI] = useState();
    const [isOneProduct, setIsOneProduct] = useState();
    const dispatch = useDispatch()

    
    const getProductsAPI = () => {
        axios.get(`${apiUrl}/products`)
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

export default getApiProducts;
