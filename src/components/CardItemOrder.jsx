import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './css/CardItemOrder.css'
const CardItemOrder = ({ isItemOrder }) => {

    const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;

    const [isProduct, setIsProduct] = useState()
    const productId = isItemOrder?.productId



    // useEffect(() => {
    //     if (productId) {
    //         axios.get(`${apiUrl}/products/${productId}`)
    //             .then(res => {
    //                 setIsProduct(res.data)
    //             })
    //             .catch(err => console.log(err))
    //     }
    // }, [productId])

    return (
        <>
            <div className="cardItemOrder">
                <div className="cardItemOrder__img">
                    <img src={isProduct?.productImgs[0].url} />                    
                </div>
            </div>

        </>
    )
}

export default CardItemOrder