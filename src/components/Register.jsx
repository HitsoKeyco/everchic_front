import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import './css/Register.css'
import useAuth from '../hooks/useAuth'
const Register = ({ setIsModalLogin, setIsModalRegister, setIsModalRecover, handleAuthModal }) => {
    const { register, handleSubmit, reset, formState: { } } = useForm()

    const [isShowPass, setIsShowPass] = useState(false)


    const handleShowHiddenPass = () => {
        setIsShowPass(!isShowPass)
    }

    const handleLoginModal = () => {
        setIsModalRegister(false)
        setIsModalLogin(true)
    }

    const handleRecoverModal = () => {
        setIsModalRegister(false)
        setIsModalRecover(true)
    }

    const { isLoged, createUser } = useAuth()

    // espera la aprobacion del usuario logeado para cerrar el modal
    useEffect(() => {
        if (isLoged) {
            handleAuthModal()
        }
    }, [isLoged])

    const onSubmit = (data) => {
        console.log(data);
        createUser(data)        
    }


    return (
        <>
            <form method='POST' className='register_form' onSubmit={handleSubmit(onSubmit)}>
                <h1 className='register_title'>Registrarse</h1>
                <div className="register_items_container">
                    <label className="register_label" htmlFor="firstName" >Nombre</label>
                    <input className="register_input" type="text" autoComplete="off"
                        {...register('firstName', { required: 'Este campo es obligatorio' })}
                    />
                </div>
                <div className="register_items_container">
                    <label className="register_label" htmlFor="lastName" >Apellidos</label>
                    <input className="register_input" type="text" autoComplete="off"
                        {...register('lastName', { required: 'Este campo es obligatorio' })}
                    />
                </div>
                <div className="register_items_container">
                    <label className="register_label" htmlFor="email" >E-mail</label>
                    <input className="register_input" type="text" autoComplete="off"
                        {...register('email', { required: 'Este campo es obligatorio' })}
                    />
                </div>
                <div className="register_items_container_pass">
                    <label className="register_label" htmlFor="password" >Contraseña</label>
                    <input className="register_input_pass" type={isShowPass ? 'text' : 'password'} id='password' name='password' autoComplete="off"
                        {...register('password', { required: 'Este campo es obligatorio' })}
                    />
                    <div className="register_show_hidden_pass" onClick={handleShowHiddenPass}>
                        {
                            isShowPass ?
                                (<i className='bx bx-show register_show_hidden_pass_icon' ></i>)
                                :
                                (<i className='bx bx-hide register_show_hidden_pass_icon'></i>)
                        }
                    </div>
                </div>
                <div className="register_items_container">
                    <button className='register_button'>Registrarse</button>
                </div>
                <div className="register_items_links_container">
                    <span className="register_register_link" onClick={handleLoginModal}>Iniciar Sesión</span>
                    <span className="register_recover_pass_link" onClick={handleRecoverModal}>¿Recuperar contraseña?</span>
                </div>
            </form>
        </>
    )
}

export default Register