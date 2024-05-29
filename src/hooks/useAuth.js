import axios from "axios"
import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setUser } from "../store/slices/user.slice";
import { deleteAllProducts } from "../store/slices/cart.slice";

const useAuth = () => {
    const [isLoged, setIsloged] = useState(false)
    
    const dispatch = useDispatch()
    const url = import.meta.env.VITE_API_URL;

    const createUser = (data) => {
        axios.post(`${url}/users`, data)
            .then(res => {
                if (res.data) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        text: "Revisa tu correo y activa tu cuenta",
                        showConfirmButton: true,
                        timer: 1500
                    });
                }
            })
            .catch(err => {
                if (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Algo salio mal!",
                    });
                }
            })
    }

    const loginUser = (data) => {
        axios.post(`${url}/users/login`, data)
            .then(res => {
                if (res.data) {
                    localStorage.setItem('token', (res.data.token))
                    localStorage.setItem('user', JSON.stringify(res.data.user))
                    dispatch(setUser(res.data))
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setIsloged(true)
                    localStorage.removeItem('likes')
                }
            })
            .catch(err => {
                if (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Algo salio mal!",
                    });
                }
            })
    }

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
    }

    return { isLoged, createUser, loginUser, logOut }
}

export default useAuth