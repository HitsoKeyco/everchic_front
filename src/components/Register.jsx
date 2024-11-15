import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import './css/Register.css'
import useAuth from '../hooks/useAuth'
import validatePasswordRegister from '../hooks/validatePasswordRegister'
import Swal from 'sweetalert2'
import { Backdrop, CircularProgress } from '@mui/material'

const Register = ({ setIsModalLogin, setIsModalRegister, setIsModalRecover, handleModalContentClick }) => {
    const [loading, setLoading] = useState(false); // Estado de carga
    const formRegister = JSON.parse(localStorage.getItem("formRegister")) || {}

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            firstName: formRegister.firstName || '',
            lastName: formRegister.lastName || '',
            email: formRegister.email || '',
        }
    })

    const firstNameValue = watch('firstName');
    const lastNameValue = watch('lastName');
    const emailValue = watch('email');


    useEffect(() => {
        const formDataRegister = {
            firstName: firstNameValue || '',
            lastName: lastNameValue || '',
            email: emailValue || '',
        }
        localStorage.setItem("formRegister", JSON.stringify(formDataRegister))
    }, [firstNameValue, lastNameValue, emailValue])

    const [isShowPass, setIsShowPass] = useState({
        password: false,
        repeat_password: false
    })

    const handleShowHiddenPass = () => {
        setIsShowPass({ ...isShowPass, password: !isShowPass.password })

    }
    const handleShowHiddenRepeatPass = () => {
        setIsShowPass({ ...isShowPass, repeat_password: !isShowPass.repeat_password })
    }

    const handleLoginModal = () => {
        setIsModalRegister(false)
        setIsModalLogin(true)
    }

    const handleRecoverModal = () => {
        setIsModalRegister(false)
        setIsModalRecover(true)
    }

    const { createUser } = useAuth()

    const submit = async (data) => {        
        setLoading(true); // Estado de carga
        try {
            const res = await createUser(data);
            if (res) {
                handleModalContentClick(false);
                reset();
                setLoading(false);
                localStorage.removeItem("formRegister");
            }
        } catch (err) {            
            setLoading(false);
        }
        finally{
            setLoading(false);
        }

    };


    return (
        <>
            <form method='POST' className='register_form' onSubmit={handleSubmit(submit)}>
                <h1 className='register_title'>Registro</h1>
                <div className="register_items_container">
                    <label className="register_label" htmlFor="firstName" >Nombres:</label>
                    <input
                        className={`register_input ${errors.firstName && 'input_error'}`}
                        type="text"
                        autoComplete="on"
                        {...register('firstName', {
                            required: {
                                value: true,
                                message: 'Este campo es requerido'
                            }
                        })}
                    />
                    {errors.firstName && <p className="error_message">{errors.firstName.message}</p>}
                </div>

                <div className="register_items_container">
                    <label className="register_label" htmlFor="lastName" >Apellidos:</label>
                    <input
                        className={`register_input ${errors.lastName && 'input_error'}`}
                        type="text"
                        autoComplete="on"
                        {...register('lastName', {
                            required: {
                                value: true,
                                message: 'Este campo es requerido'
                            }
                        })}
                    />
                    {errors.lastName && <p className="error_message">{errors.lastName.message}</p>}
                </div>

                <div className="register_items_container">
                    <label className="register_label" htmlFor="email" >E-mail:</label>
                    <input
                        className={`register_input ${errors.email && 'input_error'}`}
                        type="text"
                        autoComplete="on"
                        {...register('email', {
                            required: {
                                value: true,
                                message: 'Este campo es requerido'
                            },
                            pattern: {
                                value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
                                message: 'Formato de correo inválido.'
                            }
                        })}
                    />
                    {errors.email && <p className="error_message">{errors.email.message}</p>}

                </div>

                <div className="register_items_container_pass">
                    <label className="register_label" htmlFor="password" >Contraseña:</label>
                    <input
                        className={`register_input ${errors.password && 'input_error'}`}
                        type={isShowPass.password ? 'text' : 'password'}
                        id='password'
                        name='password'
                        autoComplete="off"
                        {...register('password', {
                            required: {
                                value: true,
                                message: 'Este campo es requerido.'
                            },
                            minLength: {
                                value: 6,
                                message: 'La contraseña debe tener al menos 6 caracteres.'
                            }

                        })}
                    />
                    {errors.password && <p className="error_message">{errors.password.message}</p>}

                    <div className="register_show_hidden_pass" onClick={handleShowHiddenPass}>
                        {
                            isShowPass.password ?
                                (<i className='bx bx-show register_show_hidden_pass_icon' ></i>)
                                :
                                (<i className='bx bx-hide register_show_hidden_pass_icon'></i>)
                        }
                    </div>
                </div>

                <div className="register_items_container_pass">
                    <label className="register_label" htmlFor="repeat_password" >Repita contraseña:</label>
                    <input
                        className={`register_input ${errors.repeat_password && 'input_error'}`}
                        type={isShowPass.repeat_password ? 'text' : 'password'}
                        id='repeat_password'
                        name='repeat_password'
                        autoComplete="off"
                        {...register('repeat_password', {
                            required: {
                                value: true,
                                message: 'Este campo es requerido.'
                            },
                            validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                            minLength: {
                                value: 6,
                                message: 'La contraseña debe tener al menos 6 caracteres.'
                            }
                        })}
                    />
                    {errors.repeat_password && <p className="error_message">{errors.repeat_password.message}</p>}

                    <div className="register_show_hidden_pass" onClick={handleShowHiddenRepeatPass}>
                        {
                            isShowPass.repeat_password ?
                                (<i className='bx bx-show register_show_hidden_pass_icon' ></i>)
                                :
                                (<i className='bx bx-hide register_show_hidden_pass_icon'></i>)
                        }
                    </div>
                </div>

                <div className="register_items_container_agreeToTerms">
                    <div className='register_items_agreeToTerms'>
                        <input
                            className={`register_input_chekbox ${errors.agreeToTerms && 'input_error'}`}
                            type="checkbox"
                            id='agreeToTerms'
                            name='agreeToTerms'
                            {...register('agreeToTerms', {
                                required: {
                                    value: true,
                                    message: 'Este campo es requerido.'
                                }
                            })}
                        />
                        <label className="register_label_agreeToTerms" htmlFor="agreeToTerms" >Acepto los términos y condiciones.</label>

                    </div>
                    {errors.agreeToTerms && <p className="error_message">{errors.agreeToTerms.message}</p>}
                </div>

                <div className="register_items_button_container">
                    <button className='register_button button'>Registrarse</button>
                </div>
                <div className="register_items_links_container">
                    <span className="register_register_link" onClick={handleLoginModal}>Iniciar Sesión</span>
                    <span className="register_recover_pass_link" onClick={handleRecoverModal}>¿Recuperar contraseña?</span>
                </div>
            </form>

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

export default Register