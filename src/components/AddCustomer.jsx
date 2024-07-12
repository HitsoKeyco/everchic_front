import React, { useEffect, useState, useCallback } from 'react';
import './css/AddCustomer.css';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Accordion, AccordionDetails, AccordionSummary, ThemeProvider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { setUpdateDataUser } from '../store/slices/user.slice';

const AddCustomer = () => {
    const dispatch = useDispatch();
    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector(state => state.user) || '';
    const { register, setValue, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            dni: '',
            firstName: '',
            lastName: '',
            email: '',
            phone_first: '',
            phone_second: '',
            address: '',
            city: ''
        }
    });

    useEffect(() => {
        if (user.token) {
            axios.get(`${apiUrl}/users/${user.user.id}`)
                .then(res => {
                    dispatch(setUpdateDataUser(res.data));
                })
                .catch(err => console.log(err));
        }
    }, [user.token, dispatch, apiUrl]);

    console.log(user);

    useEffect(() => {
        if (user) {
            setValue('dni', user.user.dni);
            setValue('firstName', user.user.firstName);
            setValue('lastName', user.user.lastName);
            setValue('phone_first', user.user.phone_first);
            setValue('phone_second', user.user.phone_second);
            setValue('city', user.user.city);
            setValue('address', user.user.address);
        }
    }, [user, setValue]);

    // Recuperar datos de localStorage al montar el componente
    useEffect(() => {
        const savedValues = localStorage.getItem('formData');
        if (savedValues) {
            const parsedValues = JSON.parse(savedValues);
            for (const [key, value] of Object.entries(parsedValues)) {
                setValue(key, value);
            }
        }
    }, [setValue]);

    // Guardar datos en localStorage al cambiar los valores del formulario
    useEffect(() => {
        const subscription = watch((values) => {
            localStorage.setItem('formData', JSON.stringify(values));
        });
        return () => subscription.unsubscribe();
    }, [watch]);



    const [isShowPass, setIsShowPass] = useState(false)
    const handleShowHiddenPass = () => {
        setIsShowPass(!isShowPass)
    }

    return (
        <>

            <Accordion>
                <AccordionSummary id="panel-header" aria-controls="panel-content" expandIcon={<ExpandMoreIcon />}>
                    <p className='add_customer_title'>Información de usuario - Envío</p>
                </AccordionSummary>
                <AccordionDetails  >
                    <form className="add_customer_container" >
                        <div className='add_customer_info_shipping'>
                            <div className='add_customer_elements_container'>
                                <label className="add_customer_label" htmlFor="dni">
                                    Cédula ó RUC:
                                </label>
                                <input
                                    type="number"
                                    id="dni"
                                    name="dni"
                                    className={`add_customer_input ${errors.dni ? 'input-error' : ''}`}
                                    {...register('dni', {
                                        required: 'Este campo es obligatorio',
                                        minLength: {
                                            value: 10,
                                        },
                                        maxLength: {
                                            value: 13,
                                        },
                                        pattern: {
                                            value: /^\d+$/,
                                        }
                                    })}
                                />
                            </div>

                            <div className="add_customer_elements_container">
                                <label className="add_customer_label" htmlFor="firstName">
                                    Nombre:
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    autoComplete="off"
                                    className={`add_customer_input ${errors.firstName ? 'input-error' : ''}`}
                                    {...register('firstName', { required: 'Este campo es obligatorio' })}
                                />
                            </div>

                            <div className="add_customer_elements_container">
                                <label className="add_customer_label" htmlFor="lastName">
                                    Apellidos:
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className={`add_customer_input ${errors.lastName ? 'input-error' : ''}`}
                                    {...register('lastName', { required: 'Este campo es obligatorio' })}
                                />
                            </div>

                            <div className="add_customer_elements_container">
                                <label className="add_customer_label" htmlFor="phone_first">
                                    Teléfono 1:
                                </label>
                                <input
                                    type="number"
                                    id="phone_first"
                                    name="phone_first"
                                    placeholder='09XXXXXXXX'
                                    className={`add_customer_input ${errors.phone_first ? 'input-error' : ''}`}
                                    {...register('phone_first', {
                                        required: 'Este campo es obligatorio',
                                        pattern: {
                                            value: /^0\d{9}$/,
                                        }
                                    })}
                                />
                            </div>

                            <div className="add_customer_elements_container">
                                <label className="add_customer_label" htmlFor="phone_second">
                                    Teléfono 2:
                                </label>
                                <input
                                    type="number"
                                    id="phone_second"
                                    name="phone_second"
                                    placeholder='09XXXXXXXX'
                                    className={`add_customer_input ${errors.phone_second ? 'input-error' : ''}`}
                                    {...register('phone_second', {
                                        pattern: {
                                            value: /^0\d{9}$/,
                                        }
                                    })}
                                />
                            </div>

                            <div className="add_customer_elements_container">
                                <label className="add_customer_label" htmlFor="city">
                                    Ciudad:
                                </label>
                                <input
                                    type="text"
                                    id='city'
                                    name='city'
                                    className={`add_customer_input ${errors.city ? 'input-error' : ''}`}
                                    {...register('city', { required: 'Este campo es obligatorio' })}
                                />
                            </div>

                            <div className="add_customer_elements_container">
                                <label className="add_customer_label" htmlFor="address">
                                    Dirección:
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    autoComplete='on'
                                    className={`add_customer_textarea ${errors.address ? 'input-error' : ''}`}
                                    {...register('address', { required: 'Este campo es obligatorio' })}
                                />
                            </div>
                            {
                                user == '' &&
                                <>
                                    <span className='add_customer_register_title'>Registro:</span>

                                    <div className="add_customer_elements_container">
                                        <label className="add_customer_label" htmlFor="email" >E-mail:</label>
                                        <input className="add_customer_input" type="text" autoComplete="off"
                                            {...register('email', { required: 'Este campo es obligatorio' })}
                                        />
                                    </div>

                                    <div className="add_customer_elements_container">
                                        <label className="add_customer_label" htmlFor="password" >Contraseña:</label>
                                        <input className="add_customer_input_pass" type={isShowPass ? 'text' : 'password'} id='password' name='password' autoComplete="off"
                                            {...register('password', { required: 'Este campo es obligatorio' })}
                                        />
                                        <div className="add_customer_show_hidden_pass" onClick={handleShowHiddenPass}>
                                            {
                                                isShowPass ?
                                                    (<i className='bx bx-show add_customer_show_hidden_pass_icon' ></i>)
                                                    :
                                                    (<i className='bx bx-hide add_customer_show_hidden_pass_icon'></i>)
                                            }
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </form>
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default AddCustomer;
