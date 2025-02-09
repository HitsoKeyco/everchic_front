import { useEffect, useState } from 'react';
import './css/Order.css';
import getConfigAuth from '../utils/getConfigAuth';
import { useSelector } from 'react-redux';
import axios from 'axios';
import OrderContainer from './OrderContainer';

const Orders = () => {
    const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;

    const [orders, setOrders] = useState([]);
    const [hiddenStates, setHiddenStates] = useState([]);
    const [iconState, setIconState] = useState(false);
    const [error, setError] = useState(null);


    const userId = useSelector(state => state.user.data?.id);
    
    useEffect(() => {
        if (userId) {
            const fetchOrders = async () => {               
                try {
                    const response = await axios.get(`${apiUrl}/orders/${userId}`, getConfigAuth());                                        
                    const ordersData = response.data;
                    setOrders(ordersData);
                    setHiddenStates(ordersData.map(() => false));
                    setError(null);
                } catch (err) {
                    console.error(err);
                    setError(err.response?.data?.message || 'Error en la petición de ordenes');
                }
            };
            fetchOrders();
        }
    }, [userId, apiUrl]);

    const handleOrderVisible = (index) => {
        setHiddenStates(prev => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
        setIconState(!iconState);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className='profile_title_shipping_container'>
                <h4 className='profile_title_shipping'>Mis pedidos</h4>
            </div>
            {orders.map((order, index) => (
                <div className={`orders_main_container ${hiddenStates[index] && 'orders_main_container_hidden'}`} key={order.id}>
                    <div className="order_main_header">
                        <span className='order_main_date'>Fecha: {formatDate(order.updatedAt)} - {order?.orderStatus.order_status.charAt(0).toUpperCase() + order?.orderStatus.order_status.slice(1)} </span>
                        <div className="orders_main_right_elements_container">
                            <span className='order_main_total'>Total: ${order.total} Inc. envío.</span>
                            <i className={`bx bx-chevron-down chevron_hidden_down ${hiddenStates[index] ? 'chevron_visible' : ''}`} onClick={() => handleOrderVisible(index)}></i>
                            <i className={`bx bx-chevron-up chevron_hidden_up ${hiddenStates[index] ? 'chevron_hidden' : ''}`} onClick={() => handleOrderVisible(index)}></i>
                        </div>
                    </div>
                    {
                        orders.length > 0 &&
                        <OrderContainer order={order} />
                    }
                </div>
            ))}
        </>
    );
};

export default Orders;
