import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './css/CardItemOrder.css'
const CardItemOrder = ({ isItemOrder }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isProduct, setIsProduct] = useState()
    const productId = isItemOrder?.productId

    console.log(productId);

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