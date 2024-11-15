import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const RegisterUser = ({ register, setValue, reset, clearErrors, errors, handleSubmit, watch, onSubmitForm }) => {

    const [isShowPass, setIsShowPass] = useState({
        password: false,
        repeat_password: false
    });

    const handleShowHiddenPass = () => {
        setIsShowPass({ ...isShowPass, password: !isShowPass.password })

    }
    const handleShowHiddenRepeatPass = () => {
        setIsShowPass({ ...isShowPass, repeat_password: !isShowPass.repeat_password })
    }

    return (
        <>
            <span className='add_customer_title'>Registro:</span>
            {/*------------------------------\\ Email //-----------------------------------*/}
            <div className="add_customer_elements_container">
                <label className="add_customer_label" htmlFor="email" >E-mail:</label>
                <input
                    className={`add_customer_input  ${errors.email ? 'input_error' : ''}`}
                    type="text"
                    autoComplete="on"
                    {...register('email', {
                        required: {
                            value: true,
                            message: 'Este campo es requerido'
                        },
                        pattern: {
                            value: /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/,
                            message: 'Formato de correo inválido.'
                        }
                    })}
                />
            </div>
            {errors.email && <p className="error_message">{errors.email.message}</p>}

            {/*------------------------------\\ Password //-----------------------------------*/}
            <div className="add_customer_elements_container">
                <label className="add_customer_label" htmlFor="password" >Contraseña:</label>
                <input
                    className={`add_customer_input ${errors.password ? 'input_error' : ''}`}
                    type={isShowPass.password ? 'text' : 'password'}
                    id='password' name='password'
                    autoComplete="off"
                    {...register('password', {
                        required: {
                            value: true,
                            message: 'Este campo es obligatorio'
                        },
                        minLength: {
                            value: 6,
                            message: 'La contraseña debe tener al menos 6 caracteres.'
                        }
                    })}
                />
                <div className="add_customer_show_hidden_pass" onClick={handleShowHiddenPass}>
                    {
                        isShowPass.password ?
                            (<i className='bx bx-show add_customer_show_hidden_pass_icon' ></i>)
                            :
                            (<i className='bx bx-hide add_customer_show_hidden_pass_icon'></i>)
                    }
                </div>
                {errors.password && <p className="error_message">{errors.password.message}</p>}
            </div>

            {/*------------------------------\\ Password Confirmation //-----------------------------------*/}
            <div className="add_customer_elements_container">
                <label className="add_customer_label" htmlFor="repeat_password" >Repita contraseña:</label>
                <input
                    className={`add_customer_input ${errors.repeat_password ? 'input_error' : ''}`}
                    type={isShowPass.repeat_password ? 'text' : 'password'}
                    id='repeat_password' name='repeat_password'
                    autoComplete="off"
                    {...register('repeat_password', {
                        required: {
                            value: true,
                            message: 'Este campo es obligatorio'
                        },
                        validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                        minLength: {
                            value: 6,
                            message: 'La contraseña debe tener al menos 6 caracteres.'
                        }
                    })}
                />
                <div className="add_customer_show_hidden_pass" onClick={handleShowHiddenRepeatPass}>
                    {
                        isShowPass.repeat_password ?
                            (<i className='bx bx-show add_customer_show_hidden_pass_icon' ></i>)
                            :
                            (<i className='bx bx-hide add_customer_show_hidden_pass_icon'></i>)
                    }
                </div>
                {errors.repeat_password && <p className="error_message">{errors.repeat_password.message}</p>}
            </div>

            {/*------------------------------\\ Terminos y condiciones //-----------------------------------*/}
            <div className="add_customer_items_container_agreeToTerms">
                <div className='add_customer_items_agreeToTerms'>
                    <input
                        className={`add_customer_input_chekbox ${errors.agreeToTerms ? 'input_error' : ''}`}
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
                    <Link to='/terms'>Acepto los términos y condiciones.</Link>
                </div>
                {errors.agreeToTerms && <p className="error_message">{errors.agreeToTerms.message}</p>}
            </div>
        </>
    )
}

export default RegisterUser