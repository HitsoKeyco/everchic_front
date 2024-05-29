import React, { useEffect, useState } from 'react'
import getConfigAuth from '../utils/getConfigAuth';
import axios from 'axios';
import OrderItem from './OrderItem';
import './css/OrderContainer.css'

const OrderContainer = ({ order }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [isGroupItemsOrder, setIsGroupItemsOrder] = useState()
    
    useEffect(() => {
        axios.get(`${apiUrl}/orders_items/order/${order.id}`, getConfigAuth())
            .then(res => {
                setIsGroupItemsOrder(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    
return (
    <>

        {

            isGroupItemsOrder && isGroupItemsOrder.map((product, index) => (
                <div className="order_product_container" key={index}>
                    <OrderItem product={product} />
                </div>
            ))

        }
    </>
)
}

export default OrderContainer