import React, { useEffect, useState, useCallback, useRef } from 'react';
import './css/AddCustomer.css';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary, Backdrop, Button, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
import { setUpdateUser } from '../store/slices/user.slice';
import { useForm } from 'react-hook-form';

import axios from 'axios';
import getConfigAuth from '../utils/getConfigAuth';
import { Link } from 'react-router-dom';
import RegisterUser from './RegisterUser';


const AddCustomer = ({ register, setValue, reset, clearErrors, errors, handleSubmit, watch, onSubmitForm }) => {
    

    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector(state => state.user?.userData);
        
    const [isEditable, setIsEditable] = useState(false);
    const [loading, setLoading] = useState(false);

    
    const [expanded, setExpanded] = useState(true);
    
    const handleExpandAccordion = () => {
        setExpanded(!expanded);
    }
    
    const saveDataUser = () => {
        if (isEditable) {   
        const data = {
            dni: watch('dni'),
            firstName: watch('firstName'),
            lastName: watch('lastName'),
            phone_first: watch('phone_first'),
            phone_second: watch('phone_second'),
            city: watch('city'),
            address: watch('address'),
        }
        
        setLoading(true);
        axios.put(`${apiUrl}/users/${user.user.id}`, data, getConfigAuth(user.token))
            .then(res => {
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Datos actualizados',
                    text: 'Tus datos han sido actualizados correctamente',
                });
                
            })
            .catch(err => {                               
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar',
                    text: 'Ha ocurrido un error al actualizar tus datos',
                });
            });
        }
    }


    return (
        <>

            <Accordion expanded={expanded} onChange={handleExpandAccordion}>
                <AccordionSummary id="panel-header" aria-controls="panel-content" expandIcon={<ExpandMoreIcon />}>
                    <p className='add_customer_title'>Información de usuario - Envío</p>
                </AccordionSummary>
                <AccordionDetails  >
                    <div className='add_customer_info_shipping' >
                        {/*------------------------------\\ dni //-----------------------------------*/}
                        <div className='add_customer_elements_container'>
                            <label className="add_customer_label" htmlFor="dni">
                                Cédula ó RUC:
                            </label>
                            <input
                                type="text"
                                id="dni"
                                name="dni"
                                className={`add_customer_input ${errors.dni ? 'input-error' : ''} ${ !isEditable && user?.user !==  null ? 'input-disabled' : ''}`}
                                autoComplete='on'
                                disabled={ user?.user ? !isEditable : isEditable}
                                {...register('dni', {
                                    required: 'Este campo es obligatorio',
                                    minLength: { value: 10 },
                                    maxLength: { value: 13 },
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
                                className={`add_customer_input ${errors.firstName ? 'input-error' : ''} ${ !isEditable && user?.user !==  null ? 'input-disabled' : ''}`}

                                disabled={ user?.user  ? !isEditable : isEditable}
                                {...register('firstName', {
                                    required: { value: true, message: 'Este campo es requerido' },
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
                                className={`add_customer_input ${errors.lastName ? 'input-error' : ''} ${ !isEditable && user?.user !==  null ? 'input-disabled' : ''}`}
                                disabled={user?.user ? !isEditable : isEditable}
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
                                className={`add_customer_input ${errors.phone_first ? 'input-error' : ''} ${ !isEditable && user?.user !==  null ? 'input-disabled' : ''}`}
                                disabled={user?.user ? !isEditable : isEditable}
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
                                className={`add_customer_input ${errors.phone_second ? 'input-error' : ''} ${ !isEditable && user?.user !==  null ? 'input-disabled' : ''}`}
                                disabled={user?.user ? !isEditable : isEditable}
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
                                className={`add_customer_input ${errors.city ? 'input-error' : ''} ${ !isEditable && user?.user !==  null ? 'input-disabled' : ''}`}
                                disabled={user?.user ? !isEditable : isEditable}
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
                            user?.user &&
                            <>
                                <div className="add_customer_elements_container">
                                    <label className="add_customer_label" htmlFor="email" >E-mail:</label>
                                    <input
                                        className={`add_customer_input  ${ !isEditable ? 'input-disabled' : ''}`}
                                        type="text"
                                        value={user?.user?.email}
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
                                disabled={user?.user ? !isEditable : isEditable}
                                className={`add_customer_textarea ${errors.address ? 'input-error' : '' } ${ !isEditable && user?.user !==  null ? 'input-disabled' : ''}`}
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
                            user?.user == null

                            ?

                            ''
                            :
                            <div className='profile_buttons_container'>
                                <Button className="profile_button" type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsEditable(prev => !prev);
                                        saveDataUser();
                                    }}>
                                    {isEditable ? 'Guardar' : 'Editar'}
                                </Button>

                            </div>

                        }

                        {/*------------------------------\\ Usuario Nuevo //-----------------------------------*/}
                        {
                                !user?.token ?
                            <>
                                <RegisterUser 
                                    register={register} 
                                    setValue={setValue} 
                                    reset={reset} 
                                    clearErrors={clearErrors}                                     
                                    handleSubmit={handleSubmit}
                                    watch={watch}
                                    errors={errors}
                                    onSubmitForm={onSubmitForm}
                                />

                            </>: ''
                        }
                    </div>
                </AccordionDetails>

            </Accordion>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default AddCustomer;
