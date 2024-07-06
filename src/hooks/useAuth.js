import axios from "axios"
import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setUser } from "../store/slices/user.slice";
import { deleteAllProducts } from "../store/slices/cart.slice";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const [isLoged, setIsloged] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const url = import.meta.env.VITE_API_URL;

    const createUser = async (data) => {
        try {
            const res = await axios.post(`${url}/users`, data);
            if (res.data.email) {
                Swal.fire({
                    icon: 'success',
                    title: 'Genial',
                    text: `Por favor verifica tu cuenta en tu correo: ${res.data.email}`,
                });
                return res.data.email
            }
        } catch (err) {
            console.log(err);
            if (err.response.data.message === 'Este email ya esta registrado, pero aun no verificado.') {
                Swal.fire({
                    icon: 'info',
                    text: err.response.data.message,
                });
            } else if (err.response.data.message === 'Este email ya esta registrado y verificado, inicia sesión') {
                Swal.fire({
                    icon: 'info',
                    text: err.response.data.message,
                });
            }
        }
    };

    const [isVerify, setIsVerify] = useState('')
    //Este email ya esta registrado y verificado, inicia sesión
    const loginUser = async (data) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, data);
    
            if (res.data.user.isVerify) {                
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                dispatch(setUser(res.data));
                setIsloged(true);
                localStorage.removeItem('likes');                
                return { state: 'success' };
            } else {
                Swal.fire({
                    icon: 'info',
                    text: 'Por favor verifica tu cuenta en tu correo',
                });
                return { state: 'notVerified' };
            }
        } catch (err) {
            if (err.response) {
                const { message } = err.response.data;
                if (message === 'La contraseña o email ingresada es incorrecta.') {
                    Swal.fire({
                        icon: 'error',
                        text: message,
                    });
                    return { state: 'invalidCredentials' };
                } else if (message === 'El usuario no existe. Por favor, regístrate para acceder a tu cuenta.') {
                    Swal.fire({
                        icon: 'info',
                        text: message,
                    });
                    return { state: 'userNotFound' };
                } else if (message === 'Tu correo electrónico no ha sido verificado. Por favor, verifica tu correo.') {
                    Swal.fire({
                        icon: 'info',
                        text: message,
                    });
                    return { state: 'notVerified' };
                }
            } else {
                // Si hay un error de red u otro tipo de error
                return { state: 'failNetwork', message: 'Error de red. Por favor, inténtelo de nuevo más tarde.' };
            }
        }
    };
    

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('likes')
        localStorage.removeItem('everchic_cart')
        localStorage.removeItem('everchic_cart_free')
        localStorage.removeItem('everchic_cart_quantity_free')
        localStorage.removeItem('selectedShippingOption')
        dispatch(setUser({ user: '', token: '' }))
        dispatch(deleteAllProducts())
        setIsloged(false)
        navigate('/')
    }

    const logOutTime = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('likes')
        dispatch(setUser({ user: '', token: '' }))
        setIsloged(false)
    }

    return { isLoged, createUser, loginUser, logOut, logOutTime }
}

export default useAuth