import axios from "axios"
import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setUpdateUser, setUser } from "../store/slices/user.slice";
import { deleteAllProducts } from "../store/slices/cart.slice";
import { useNavigate } from "react-router-dom";


const useAuth = () => {
    const [isLoged, setIsloged] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const url = import.meta.env.VITE_API_URL;

    function capitalizeFirstLetter(string) {
        return string.replace(/^\w/, (c) => c.toUpperCase());
    }

    const createUser = async (data) => {
        try {
            const res = await axios.post(`${url}/users`, data);            
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
        await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, data)
            .then(res => {
                
                if (res.data.user) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sesión Iniciada',
                        text: `Bienvenido ${res.data.user?.firstName}`,
                    })
                    localStorage.removeItem('likes');                                  
                    dispatch(setUpdateUser({ token: res.data?.token, user: res.data?.user}));                    
                    setIsloged(true);
                }
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
        dispatch(setUpdateUser({ token: null , user: {}}))
        dispatch(deleteAllProducts())
        setIsloged(false)
        navigate('/')
    }

    const logOutTime = () => {
        localStorage.clear();      
        dispatch(setUser({ token: null, user: {}}))
        setIsloged(false)
    }

    return { isLoged, createUser, loginUser, logOut, logOutTime }
}

export default useAuth