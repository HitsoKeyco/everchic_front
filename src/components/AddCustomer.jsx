import React, { useEffect, useState, useCallback } from 'react';
import './css/AddCustomer.css';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
import { setUpdateUser, setUser } from '../store/slices/user.slice';
import { useWatch } from 'react-hook-form';


const AddCustomer = ({ register, errors, watch, setValue, control, getValues }) => {
    const userData = useSelector(state => state.user.userData?.user) || {};
    const [isShowPass, setIsShowPass] = useState({
        password: false,
        repeat_password: false
    })

    // Observar todos los valores del formulario
    const dispatch = useDispatch();
    const dataForm = getValues();
    const dniValue = useWatch({
        control,
        name: 'dni'
    });

    const firstNameValue = watch('firstName');
    const lastNameValue = watch('lastName');
    const phoneFirstValue = watch('phone_first');
    const phoneSecondValue = watch('phone_second');
    const cityValue = watch("city")
    const emailValue = watch('email');
    const addressValue = watch('address')


    // Cargar datos iniciales del localStorage
    useEffect(() => {
        setValue('dni', userData?.dni);
        setValue('firstName', userData?.firstName);
        setValue('lastName', userData?.lastName);
        setValue('phone_first', userData?.phone_first);
        setValue('phone_second', userData?.phone_second);
        setValue('city', userData?.city);
        setValue('address', userData?.address);
        setValue('email', userData?.email);
        
    }, [setValue, userData]);
    
    //Guardar datos en Redux store cada vez que cambian los valores del formulario
    useEffect(() => {
        const data = {...userData, ...dataForm}
        dispatch(setUpdateUser(data));
    }, [dispatch,
         dniValue,
         firstNameValue,
         lastNameValue,
         phoneFirstValue,
         phoneSecondValue,
         cityValue,
         emailValue,
         addressValue,         
        ]);
    


    const handleShowHiddenPass = () => {
        setIsShowPass({ ...isShowPass, password: !isShowPass.password })

    }
    const handleShowHiddenRepeatPass = () => {
        setIsShowPass({ ...isShowPass, repeat_password: !isShowPass.repeat_password })
    }

    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setExpanded(true);
            handleShowAlert()
        }
    }, [errors])

    const handleExpandAccordion = () => {
        setExpanded(!expanded);
    }

    //Mostrar alerta Sweet alert si todavia el formulario  no esta completo 
    const handleShowAlert = () => {
        Swal.fire({
            title: '¡Atención!',
            text: 'Por favor, complete todos los campos del formulario',
            icon: 'warning',
        })
    }




    return (
        <>

            <Accordion expanded={expanded} onChange={handleExpandAccordion}>
                <AccordionSummary id="panel-header" aria-controls="panel-content" expandIcon={<ExpandMoreIcon />}>
                    <p className='add_customer_title'>Información de usuario - Envío</p>
                </AccordionSummary>
                <AccordionDetails  >
                    <div className='add_customer_info_shipping'>

                        {/*------------------------------\\ dni //-----------------------------------*/}
                        <div className='add_customer_elements_container'>
                            <label className="add_customer_label" htmlFor="dni">
                                Cédula ó RUC:
                            </label>
                            <input
                                type="text"
                                id="dni"
                                name="dni"
                                className={`add_customer_input ${errors.dni ? 'input-error' : ''}`}
                                autoComplete='on'
                                {...register('dni', {
                                    required: {
                                        value: true,
                                        message: 'Este campo es requerido',
                                    },
                                    minLength: {
                                        value: 10,
                                    },
                                    maxLength: {
                                        value: 13,
                                    },
                                    pattern: {
                                        value: /^[0-9]{10,13}$/,
                                        message: 'La cédula/RUC debe ser un número entre 10 y 13 dígitos',
                                    }
                                })}
                            />
                        </div>
                        {errors.dni && <p className="error_message">{errors.dni.message}</p>}

                        {/*------------------------------\\ FirstName //-----------------------------------*/}
                        <div className="add_customer_elements_container">
                            <label className="add_customer_label" htmlFor="firstName">
                                Nombre:
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                autoComplete="on"
                                className={`add_customer_input ${errors.firstName && 'input_error'}`}
                                {...register('firstName', {
                                    required: {
                                        value: true,
                                        message: 'Este campo es requerido',
                                    },
                                    maxLength: 25,
                                })}
                            />
                        </div>
                        {errors.firstName && <p className="error_message">{errors.firstName.message}</p>}

                        {/*------------------------------\\ LastName //-----------------------------------*/}
                        <div className="add_customer_elements_container">
                            <label className="add_customer_label" htmlFor="lastName">
                                Apellidos:
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                autoComplete="on"
                                className={`add_customer_input ${errors.lastName && 'input-error'}`}
                                {...register('lastName', {
                                    required: {
                                        value: true,
                                        message: 'Este campo es requerido',
                                    },
                                    maxLength: 25,
                                })}
                            />
                        </div>
                        {errors.lastName && <p className="error_message">{errors.lastName.message}</p>}

                        {/*------------------------------\\ Phone 1//-----------------------------------*/}
                        <div className="add_customer_elements_container">
                            <label className="add_customer_label" htmlFor="phone_first">
                                Teléfono 1:
                            </label>
                            <input
                                type="text"
                                id="phone_first"
                                name="phone_first"
                                placeholder='09XXXXXXXX'
                                className={`add_customer_input ${errors.phone_first && 'input-error'}`}
                                {...register('phone_first', {
                                    required: {
                                        value: true,
                                        message: 'Este campo es requerido',
                                    },
                                    pattern: {
                                        value: /^0\d{9}$/,
                                    },
                                    minLength: 10,
                                    maxLength: 10,
                                })}
                            />
                        </div>
                        {errors.phone_first && <p className="error_message">{errors.phone_first.message}</p>}

                        {/*------------------------------\\ Phone 2//-----------------------------------*/}
                        <div className="add_customer_elements_container">
                            <label className="add_customer_label" htmlFor="phone_second">
                                Teléfono 2:
                            </label>
                            <input
                                type="text"
                                id="phone_second"
                                name="phone_second"
                                placeholder='09XXXXXXXX'
                                className={`add_customer_input ${errors.phone_second ? 'input-error' : ''}`}
                                {...register('phone_second', {
                                    required: {
                                        value: false,
                                    },
                                    pattern: {
                                        value: /^0\d{9}$/,
                                    },
                                    minLength: 10,
                                    maxLength: 10,
                                })}
                            />
                        </div>
                        {errors.phone_second && <p className="error_message">{errors.phone_second.message}</p>}

                        {/*------------------------------\\ City //-----------------------------------*/}
                        <div className="add_customer_elements_container">
                            <label className="add_customer_label" htmlFor="city">
                                Ciudad:
                            </label>
                            <input
                                type="text"
                                id='city'
                                name='city'
                                className={`add_customer_input ${errors.city && 'input-error'}`}
                                {...register('city', {
                                    required: {
                                        value: true,
                                        message: 'Este campo es requerido'
                                    },
                                })}
                            />
                        </div>
                        {errors.city && <p className="error_message">{errors.city.message}</p>}

                        {
                            userData.email &&
                            <>
                                <div className="add_customer_elements_container">
                                    <label className="add_customer_label" htmlFor="email" >E-mail:</label>
                                    <input
                                        className='add_customer_input disabled-input'
                                        type="text"
                                        value={userData.email}
                                        disabled={true}
                                    />
                                </div>
                            </>
                        }

                        {/*------------------------------\\ Address //-----------------------------------*/}
                        <div className="add_customer_elements_container">
                            <label className="add_customer_label" htmlFor="address">
                                Dirección:
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                autoComplete='on'
                                className={`add_customer_textarea ${errors.address && 'input-error'}`}
                                {...register('address', {
                                    required: {
                                        value: true,
                                        message: 'Este campo es requerido'
                                    },
                                    maxLength: 60,
                                })}
                            />
                        </div>
                        {errors.address && <p className="error_message">{errors.address.message}</p>}

                        {
                            !userData?.email &&
                            <>
                                <span className='add_customer_title'>Registro:</span>

                                <div className="add_customer_elements_container">
                                    <label className="add_customer_label" htmlFor="email" >E-mail:</label>
                                    <input
                                        className={`add_customer_input  ${errors.email && 'input_error'}`}
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

                                <div className="add_customer_elements_container">
                                    <label className="add_customer_label" htmlFor="password" >Contraseña:</label>
                                    <input
                                        className={`add_customer_input ${errors.password && 'input_error'}`}
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


                                <div className="add_customer_elements_container">
                                    <label className="add_customer_label" htmlFor="repeat_password" >Repita contraseña:</label>
                                    <input
                                        className={`add_customer_input ${errors.repeat_password && 'input_error'}`}
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

                                <div className="add_customer_items_container_agreeToTerms">
                                    <div className='add_customer_items_agreeToTerms'>
                                        <input
                                            className={`add_customer_input_chekbox ${errors.agreeToTerms && 'input_error'}`}
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
                                        <a className="add_customer_label_agreeToTerms" htmlFor="agreeToTerms" >Acepto los términos y condiciones.</a>

                                    </div>
                                    {errors.agreeToTerms && <p className="error_message">{errors.agreeToTerms.message}</p>}
                                </div>

                            </>
                        }
                    </div>
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default AddCustomer;
