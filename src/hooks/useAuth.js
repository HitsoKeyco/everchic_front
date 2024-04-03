import axios from "axios"
import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setUser } from "../store/slices/user.slice";

const useAuth = () => {
    const [isLoged, setIsloged] = useState(false)
    const dispatch = useDispatch()
    const url = import.meta.env.VITE_API_URL;
    const createUser = (data) => {
        axios.post(`${url}/users`, data)
            .then(res => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    text: "Revisa tu correo y activa tu cuenta",
                    showConfirmButton: true,
                    timer: 1500
                });
                setIsloged(!isLoged)
            })
            .catch(err => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Algo salio mal!",
                });
            })
    }

    const loginUser = (data) => {
        axios.post(`${url}/users/login`, data)
            .then(res => {
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('user', JSON.stringify(res.data.user))
                dispatch(setUser(res.data))
                Swal.fire({
                    position: "center",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                setIsloged(!isLoged)
            })
            .catch(err => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Algo salio mal!",
                });
            })
    }

    const logOut = (data) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(setUser({}))
    }

    return { isLoged, createUser, loginUser, logOut }
}

export default useAuth