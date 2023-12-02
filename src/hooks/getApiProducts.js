import axios from "axios";
import { useState } from "react";



const getApiProducts = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const [ productsAPI, setProductsAPI] = useState()


    const getProductsAPI = () => {
        axios.get(`${apiUrl}/products`)
        .then(res => {
            setProductsAPI(res.data)
        })
        .catch(err => {
            console.log(err);
        });
    }

    return {productsAPI, getProductsAPI}
}

export default getApiProducts;