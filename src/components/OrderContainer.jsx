// OrderContainer.js
import { useEffect, useState } from 'react';
import getConfigAuth from '../utils/getConfigAuth';
import axios from 'axios';
import OrderItem from './OrderItem';
import PropTypes from 'prop-types';
import './css/OrderContainer.css';

const OrderContainer = ({ order }) => {
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!apiUrl) {
            console.error('API URL is not defined');
            return;
        }

        const fetchOrderItems = async () => {
            try {
                const response = await axios.get(`${apiUrl}/orders_items/order/${order.id}`, getConfigAuth());
                const itemsData = response.data;
                setItems(itemsData);
                
                const productPromises = itemsData.map(item => axios.get(`${apiUrl}/products/${item.productId}`, getConfigAuth()));
                const productsData = await Promise.all(productPromises);
                setProducts(productsData.map(res => res.data));
            } catch (err) {
                console.error(err);
            }
        };

        fetchOrderItems();
    }, [order.id, apiUrl]);

    return (
        <>
            {items.map((item, index) => (
                <div className="order_product_container" key={item.id}>
                    <OrderItem product={item} productData={products[index]} />
                </div>
            ))}
        </>
    );
};

OrderContainer.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
};

export default OrderContainer;