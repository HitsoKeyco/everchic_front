import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CardItemOrder from './CardItemOrder';
import './css/OrderItem.css'

const OrderItem = ({ product }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isProduct, setIsProduct] = useState()   

    
    
    useEffect(() => {
        axios.get(`${apiUrl}/products/${product.productId}`)
            .then(res => {
                setIsProduct(res.data)
            })
            .catch(err => console.log(err))
    }, [product])

    const total = parseFloat((product.price_unit * product.quantity)).toFixed(2)
    return (
        <>
            {
                <div className="order_item_product_container">
                    <div className="order_item_product_image_container">
                        <img src={isProduct?.productImgs[0]?.url} alt={isProduct?.title} className="order_item_product_image" />
                    </div>
                    <div className="order_item_product_body">
                        <ul className='order_item_product_ul'>
                            <li className='order_item_product_title'>{isProduct?.title}</li>
                            <li className='order_item_product_quantity'>Cantidad: {product.quantity}</li>
                            <li className='order_item_product_size'>Talla: {isProduct?.size.size}</li>
                            <li className='order_item_product_subtotal'>Subtotal: {total}</li>
                        </ul>
                    </div>
                </div>
            }
        </>
    )
}

export default OrderItem