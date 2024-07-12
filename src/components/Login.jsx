import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import './css/Login.css'
import useAuth from '../hooks/useAuth'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'


const Login = ({ setIsModalLogin, setIsModalRegister, setIsModalRecover, handleModalContentClick }) => {
    const { register, handleSubmit, formState: { } } = useForm()

    const navigate = useNavigate()

    const userVerify = useSelector(state => state.user.user)




    const [isShowPass, setIsShowPass] = useState(false)
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
    }, [isLoged])

    const [isResendEmail, setIsResendEmail] = useState(false);

    const onSubmit = async (data) => {  
                 
            if(isResendEmail){                             
                await reSendEmail(data.email);
                setIsResendEmail(false)                                      
            }else{

            const result = await loginUser(data);           
            if(result.state == 'notVerified'){
                setIsResendEmail(true)
            }else if(result.state == 'success'){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Bienvenido',
                    showConfirmButton: false,                    
                    timer: 1500
                })               

            }
        }


    }

    const reSendEmail = async (email) => {
        const url = `${import.meta.env.VITE_API_URL}/users/resend_email`;
        const res = await axios.post(url, { email });
        if (res.data.message == "Se ha enviado un correo de verificación") {
            Swal.fire({
                icon: 'success',
                title: 'Correo electrónico enviado',
                text: 'Revisa tu correo electrónico para activar tu cuenta',
            });
            setIsResendEmail(false);   
        }
    }


    //manejador de logOut
    const onLogOut = () => {
        logOut();
        navigate('/')
        handleModalContentClick()
    }



    return (
        <>

            {
                userVerify?.isVerify ?
                    (

                        <form className="login_form_logout" action="" onSubmit={handleSubmit(onLogOut)}>
                            <h3 className='login_form_info_user'>Hola {userVerify?.firstName}</h3>
                            <button className='login_button_logout button'>Cerrar sesión</button>
                        </form>
                    )
                    :
                    (
                        <form method='POST' className='login_form' onSubmit={handleSubmit(onSubmit)}>
                            <h1 className='login_title'>Iniciar sesión</h1>
                            <div className="login_items_container">
                                <label className="login_label" htmlFor="email" >E-mail:</label>
                                <input className="login_input" type="text" autoComplete="off"
                                    {...register('email', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                            <div className="login_items_container">
                                <label className="login_label" htmlFor="password" >Contraseña:</label>
                                <input className="login_input_pass" type={isShowPass ? 'text' : 'password'} id='password' name='password' autoComplete="off"
                                    {...register('password', { required: 'Este campo es obligatorio' })}
                                />
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
                                    className="g-recaptcha login_button button"
                                    data-sitekey="6Lfu16IpAAAAAIuKKGjZSATdGSh6PNkndSQ-9wwB"
                                    data-callback="onSubmit"
                                    data-action="submit"
                                >
                                    Acceder
                                </button>
                                {
                                    isResendEmail && (
                                        <button
                                            className="g-recaptcha login_button button"
                                            data-sitekey="6Lfu16IpAAAAAIuKKGjZSATdGSh6PNkndSQ-9wwB"
                                            data-callback="onSubmit"
                                            data-action="submit"
                                        >
                                            Reenviar email
                                        </button>
                                    )
                                }
                            </div>
                            <div className='login_messaje'>
                            </div>
                            <div className="login_items_links_container">
                                <span className="login_register_link" onClick={handleModalRegister}>Registrarse</span>
                                <span className="login_recover_pass_link" onClick={handleModalRecover}>¿Recuperar contraseña?</span>
                            </div>
                        </form>
                    )
            }
        </>
    )
}

export default Login