import axios from "axios"
import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setUser } from "../store/slices/user.slice";
import { deleteAllProducts } from "../store/slices/cart.slice";
import { useNavigate } from "react-router-dom";


const useAuth = () => {
    const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;

    const [isLoged, setIsloged] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    

    function capitalizeFirstLetter(string) {
        return string.replace(/^\w/, (c) => c.toUpperCase());
    }

    const createUser = async (data) => {
        try {
            const res = await axios.post(`${apiUrl}/users`, data);            
            const name = capitalizeFirstLetter(res.data?.firstName)
            if (res.data.email) {
                Swal.fire({
                    icon: 'success',
                    title: `Hola ${name}`,
                    text: `Por favor verifica tu cuenta en tu correo: ${res.data.email}`,
                });
                return res.data.email
            }

            

        } catch (err) {
            console.log(err);
            if (err.response.data.message === 'Su email ya esta registrado, pero aun no verificado.') {
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

    const loginUser = async (data) => {
        await axios.post(`${apiUrl}/users/login`, data)
            .then(res => {
                
                if (res.data) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sesión Iniciada',
                        text: `Bienvenido ${res.data.user?.firstName}`,
                    })
                }
                localStorage.removeItem('likes');   
                dispatch(setUser(res.data))
                setIsloged(true)
            })           

            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.data.message,
                })
            })

    };


    const logOut = () => {        
        localStorage.clear();        
        dispatch(setUser({ token: null , user: {}}))
        dispatch(deleteAllProducts())
        setIsloged(false)
        navigate('/')
    }

    const logOutTime = () => {
        localStorage.clear();      
        dispatch(setUser({ token: null, user: {} }))
        setIsloged(false)
    }

    return { isLoged, createUser, loginUser, logOut, logOutTime }
}

export default useAuth