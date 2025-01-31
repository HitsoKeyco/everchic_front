import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import './css/Login.css'
import useAuth from '../hooks/useAuth'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Backdrop, CircularProgress } from '@mui/material'


const Login = ({ setIsModalLogin, setIsModalRegister, setIsModalRecover, handleModalContentClick }) => {

    const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;

    const user = useSelector(state => state.user?.data);
    
    const [isShowPass, setIsShowPass] = useState(false)
    const [loading, setLoading] = useState(false); // Estado de carga
    

    const { register, handleSubmit, formState: { errors } } = useForm();

    //Funcion que controla la visualizacion de la contraseña
    const handleShowHiddenPass = () => {
        setIsShowPass(!isShowPass)
    }

    //Funcion que controla modal registro
    const handleModalRegister = () => {
        setIsModalLogin(false)
        setIsModalRegister(true)
    }

    //Funcion que controla modal recuperar contraseña
    const handleModalRecover = () => {
        setIsModalLogin(false)
        setIsModalRecover(true)
    }

    //Funciones para Auth
    const { isLoged, loginUser, logOut } = useAuth()

    // espera la aprobacion del usuario logeado para cerrar el modal porq onSubmit es asincrono
    useEffect(() => {
        if (isLoged) {
            handleModalContentClick()
        }
    }, [isLoged, handleModalContentClick])

    const [isResendEmail, setIsResendEmail] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            await loginUser(data);
            setLoading(false)
        } catch (err) {
            setLoading(false)
        }
    }

    const handleResendEmail = async (e) => {
        e.preventDefault()
        setLoading(true)
        const email = e.target.form.email.value;

        try {
            const url = `${apiUrl}/users/resend_email`;
            const res = await axios.post(url, { email });
            if (res.data.message == "Se ha enviado un correo de verificación") {
                Swal.fire({
                    icon: 'success',
                    title: 'Correo electrónico enviado',
                    text: 'Revisa tu correo electrónico para activar tu cuenta',
                });
                setLoading(false)
                setIsResendEmail(false);
            }

        } catch (err) {            
            if (err.response.data.message === "Usuario no encontrado") {
                Swal.fire({
                    icon: 'error',
                    title: 'Email invalido',
                    text: 'Opps.. algo salio mal.. !!',
                });
                setLoading(false)
            }
        }

    }
    
    //manejador de logOut
    const onLogOut = () => {
        setLoading(true)
        logOut();        
        handleModalContentClick();
        setLoading(false)

    }


    return (
        <>

            {
                user?.email ?
                    (

                        <form className="login_form_logout" action="" onSubmit={handleSubmit(onLogOut)}>
                            <h3 className='login_form_info_user'> {`Hola`}</h3>
                            <h3 className='login_form_info_user_firstName'> {`${user?.firstName}`}</h3>
                            <button className='login_button_logout button'>Cerrar sesión</button>
                        </form>
                    )
                    :
                    (
                        <form method='POST' className='login_form' onSubmit={handleSubmit(onSubmit)}>
                            <h1 className='login_title'>Iniciar sesión</h1>
                            <div className="login_items_container">
                                <label className="login_label" htmlFor="email" >E-mail:</label>
                                <input
                                    className={`login_input ${errors.email && 'input_error'}`}
                                    type="text" autoComplete="on"
                                    {...register('email', {
                                        required: {
                                            value: true,
                                            message: 'El campo es requerido'
                                        },
                                        pattern: {
                                            value: /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/,
                                            message: 'Formato de correo inválido.'
                                        }
                                    })}
                                />
                                {errors.email && <p className="error_message">{errors.email.message}</p>}
                            </div>
                            <div className="login_items_container">
                                <label className="login_label" htmlFor="password" >Contraseña:</label>
                                <input
                                    className={`login_input_pass ${errors.password && 'input_error'}`}
                                    type={isShowPass ? 'text' : 'password'}
                                    id='password' name='password' autoComplete="off"
                                    {...register('password', {
                                        required: {
                                            value: true,
                                            message: 'El campo es requerido'
                                        },
                                        minLength: {
                                            value: 6,
                                            message: 'La contraseña debe tener al menos 6 caracteres'
                                        }
                                    })}
                                />
                                {errors.password && <p className="error_message">{errors.password.message}</p>}

                                <div className="login_show_hidden_pass" onClick={handleShowHiddenPass}>
                                    {
                                        isShowPass ?
                                            (<i className='bx bx-show register_show_hidden_pass_icon' ></i>)
                                            :
                                            (<i className='bx bx-hide register_show_hidden_pass_icon'></i>)
                                    }
                                </div>
                            </div>
                            <div className="login_items_button_container">
                                <button
                                    className="login_button button"
                                >
                                    Acceder
                                </button>

                            </div>
                            {
                                isResendEmail && (
                                    <button
                                        className="login_button button"
                                        onClick={handleResendEmail}
                                    >
                                        Reenviar email
                                    </button>
                                )
                            }
                            <div className="login_items_links_container">
                                <span className="login_register_link" onClick={handleModalRegister}>Registrarse</span>
                                <span className="login_recover_pass_link" onClick={handleModalRecover}>¿Recuperar contraseña?</span>
                            </div>


                        </form>
                    )
            }
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>

    )
}

import PropTypes from 'prop-types';

Login.propTypes = {
    setIsModalLogin: PropTypes.func.isRequired,
    setIsModalRegister: PropTypes.func.isRequired,
    setIsModalRecover: PropTypes.func.isRequired,
    handleModalContentClick: PropTypes.func.isRequired,
};

Login.defaultProps = {
    setIsModalLogin: () => {},
    setIsModalRegister: () => {},
    setIsModalRecover: () => {},
    handleModalContentClick: () => {},
};

export default Login