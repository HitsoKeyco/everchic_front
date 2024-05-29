import { useEffect, useState } from 'react'
import './css/Order.css'
import getConfigAuth from '../utils/getConfigAuth';
import { useSelector } from 'react-redux';
import axios from 'axios';
import OrderContainer from './OrderContainer';

const Orders = () => {
    const [isOrder, isSetOrder] = useState();
    const [hiddenStates, setHiddenStates] = useState([]);
    const [iconState, setIconState] = useState(false)

    const apiUrl = import.meta.env.VITE_API_URL;
    const userId = useSelector(state => state.user.user.id);

    // Buscamos los ID de las ordenes que ha realizado el cliente 
    useEffect(() => {
        if (userId) {
            axios.get(`${apiUrl}/orders/${userId}`, getConfigAuth())
                .then(res => {
                    isSetOrder(res.data);
                    setHiddenStates(res.data.map(() => false)); // Inicializamos todos los estados como false
                })
                .catch(err => console.log(err));
        }
    }, []);

    const handleOrderVisible = (index) => {
        const updatedHiddenStates = [...hiddenStates]; // Creamos una copia del array de estados
        updatedHiddenStates[index] = !updatedHiddenStates[index]; // Cambiamos el estado del elemento en el índice dado
        setHiddenStates(updatedHiddenStates); // Actualizamos el estado
        setIconState(!iconState)
    }

    console.log(isOrder);

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            {isOrder && isOrder.map((order, index) => (
                <div className={`orders_main_container ${hiddenStates[index] && 'orders_main_container_hidden'}`} key={index}>
                    <div className="order_main_header">
                        <span className='order_main_date'>Fecha: {formatDate(order.updatedAt)}</span>
                        <div className="orders_main_right_elements_container">
                        <span className='order_main_total'>Total: ${order.total} Inc. envío.</span>
                        <i className={`bx bx-chevron-down chevron_hidden_down ${hiddenStates[index] ? 'chevron_visible' : ''}`} onClick={() => handleOrderVisible(index)}></i>
                        <i className={`bx bx-chevron-up chevron_hidden_up ${hiddenStates[index] ? 'chevron_hidden' : ''}`} onClick={() => handleOrderVisible(index)}></i>
                        </div>

                    </div>
                    <OrderContainer order={order} />
                </div>
            ))}
        </>
    );
}

export default Orders;

