import React, { useEffect, useState } from 'react';
import './css/RegisterCart.css';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

const RegisterCart = ({ setNewUser }) => { 

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const user = useSelector(state => state.user) || null;

    const [isShowPass, setIsShowPass] = useState(false);

    const handleShowHiddenPass = () => {
        setIsShowPass(!isShowPass);
    };

    const handleFormChange = () => {
        const subscription = watch((data) => {
            setNewUser(data);
        });
        return () => subscription.unsubscribe();
    };

    // Use effect to watch changes in the form data
    useEffect(handleFormChange, [watch, setNewUser]);

    return (
        <div className="register_cart_register_container">
            {
                !user.token &&
                (
                    <>
                        <form onChange={handleFormChange}>
                            <h1 className='register_cart_register_title'>Registro</h1>
                            <div className="register_cart_register_user_container">
                                <div className='register_cart_elements_container'>
                                    <label className="register_cart_label" htmlFor="email">
                                        Email:
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        autoComplete='on'
                                        className={`register_cart_input ${errors.email ? 'input-error' : ''}`}
                                        {...register('email', {
                                            required: 'Este campo es obligatorio',
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                                            }
                                        })}
                                    />
                                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                                </div>
                                <div className="register_cart_register_container_element">
                                    <label className="register_cart_label" htmlFor="password">
                                        Contraseña:
                                    </label>
                                    <input
                                        type={isShowPass ? 'text' : 'password'}
                                        id='password'
                                        name='password'
                                        className={`register_cart_input register_cart_input_paddingbx ${errors.password ? 'input-error' : ''}`}
                                        {...register('password', { required: 'Este campo es obligatorio' })}
                                    />
                                    <div className="register_cart_show_hidden_pass" onClick={handleShowHiddenPass}>
                                        {
                                            isShowPass ?
                                                (<i className='bx bx-show register_cart_show_hidden_pass_icon' ></i>)
                                                :
                                                (<i className='bx bx-hide register_cart_show_hidden_pass_icon'></i>)
                                        }
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
                )
            }
        </div>
    );
};

export default RegisterCart;
