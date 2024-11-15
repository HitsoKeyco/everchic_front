import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './css/Profile.css';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import getConfigAuth from '../utils/getConfigAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import Orders from '../components/Orders';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Backdrop, Button, CircularProgress } from '@mui/material';
import { setUpdateUser } from '../store/slices/user.slice';
import AddCustomer from '../components/AddCustomer';

const Profile = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const keyHcaptcha = import.meta.env.VITE_HCAPTCHA_KEY_SITE;

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const { register, setValue, handleSubmit, formState: { errors } } = useForm();

    const user = useSelector(state => state.user.userData?.user || {});
    const token = useSelector(state => state.user.userData?.token || {});
    const [tokenCaptcha, setTokenCaptcha] = useState(null);
    const [isValidCaptcha, setIsValidCaptcha] = useState(false);
    const [isCaptchaExpired, setIsCaptchaExpired] = useState(false);
    const [error, setError] = useState(null);

    const theme = useSelector(state => state.user.theme);
    const captchaRef = useRef(null);

    useEffect(() => {
        if (user && user.id) {
            loadDataUser();
        }
    }, [user]);

    const handleVerifyCaptcha = (tokenCaptcha) => {
        setTokenCaptcha(tokenCaptcha);
        setIsValidCaptcha(true);
        setIsCaptchaExpired(false);
    };

    const handleExpireCaptcha = () => {
        setIsValidCaptcha(false);
        setIsCaptchaExpired(false);
    };

    const verifyCaptcha = () => {
        return new Promise((resolve, reject) => {
            setLoading(true);
            axios.post(`${apiUrl}/orders/verify_captcha`, { tokenCaptcha })
                .then(res => {
                    setIsValidCaptcha(true);
                    resolve();
                })
                .catch(err => {
                    setIsValidCaptcha(false);
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        text: "Captcha inválido",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    reject();
                })
                .finally(() => {
                    setLoading(false);
                    captchaRef.current.resetCaptcha();
                });
        });
    };

    const submit = async (data) => {
        await verifyCaptcha();
    
        if (isValidCaptcha) {
            setLoading(true);
    
            // Compara los datos y extrae los campos modificados
            const updatedFields = {};
    
            // Compara cada campo para ver si ha cambiado
            if (data.dni !== user.dni) updatedFields.dni = data.dni;
            if (data.firstName !== user.firstName) updatedFields.firstName = data.firstName;
            if (data.lastName !== user.lastName) updatedFields.lastName = data.lastName;
            if (data.phone_first !== user.phone_first) updatedFields.phone_first = data.phone_first;
            if (data.phone_second !== user.phone_second) updatedFields.phone_second = data.phone_second;
            if (data.email !== user.email) updatedFields.email = data.email;
            if (data.city !== user.city) updatedFields.city = data.city;
            if (data.address !== user.address) updatedFields.address = data.address;
    
            // Solo si hay cambios, actualiza el estado
            if (Object.keys(updatedFields).length > 0) {
                // Mantén el token y el id, y solo actualiza los campos modificados
                const userData = {
                    token: token,
                    user: {
                        id: user.id,
                        ...updatedFields
                    }
                };
    
                axios.put(`${apiUrl}/users/${user.id}/update_user`, userData, getConfigAuth())
                    .then(res => {
                        // Actualizar los datos en el Redux y en el localStorage
                        dispatch(setUpdateUser(res.data));
                        setIsEditable(false);
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            text: "Actualización completada",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        
                        // Si ocurre un error, mantener los valores anteriores
                        setValue('dni', user.dni);
                        setValue('firstName', user.firstName);
                        setValue('lastName', user.lastName);
                        setValue('phone_first', user.phone_first);
                        setValue('phone_second', user.phone_second);
                        setValue('city', user.city);
                        setValue('address', user.address);
    
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            text: "Opps.. No se ha podido actualizar.. intentalo nuevamente",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                // Si no hay cambios, no hacer nada
                setLoading(false);
                Swal.fire({
                    position: "center",
                    icon: "info",
                    text: "No hubo cambios para actualizar",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };
    

    const loadDataUser = () => {
        setLoading(true);
        axios.get(`${apiUrl}/users/${user.id}`, getConfigAuth())
            .then(res => {
                setValue('dni', res.data.dni);
                setValue('firstName', res.data.firstName);
                setValue('lastName', res.data.lastName);
                setValue('phone_first', res.data.phone_first);
                setValue('phone_second', res.data.phone_second);
                setValue('city', res.data.city);
                setValue('address', res.data.address);
            })
            .catch(err => {
                console.log(err);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    text: "Error al cargar los datos del usuario",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <motion.div
            className="product_filter_elements_container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="profile_container">
                <div className="profile_title_container">
                    <div className="profile_avatar_container">
                        <img className='profile_avatar' src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?.firstName}`} alt="" />
                    </div>
                    <div className="profile_avatar_info_container">
                        <h3 className='profile_title'>{user.firstName + ' ' + user.lastName}</h3>
                        <p className='profile_subtitle'>{user.city}</p>
                    </div>
                </div>

                <div className="profile_data_customer_container">
                    <div className="profile_container_orders">
                        <Orders />
                    </div>

                    <form className="profile_form" onSubmit={handleSubmit(submit)}>
                        <h4 className='profile_title_shipping'>Datos de envío</h4>

                        {/*------------------------------\\ dni //-----------------------------------*/}
                        <div className='profile_elements_container'>
                            <label className="profile_label" htmlFor="dni">Cédula ó RUC:</label>
                            <input
                                type="text"
                                id="dni"
                                name="dni"
                                className={`profile_input ${errors.dni ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                                disabled={!isEditable}
                                autoComplete='on'
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
                        <div className="profile_elements_container">
                            <label className="profile_label" htmlFor="firstName">Nombre:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                autoComplete="off"
                                className={`profile_input ${errors.firstName ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                                disabled={!isEditable}
                                {...register('firstName', {
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: 25,
                                })}
                            />
                        </div>
                        {errors.firstName && <p className="error_message">{errors.firstName.message}</p>}

                        {/*------------------------------\\ LastName //-----------------------------------*/}
                        <div className="profile_elements_container">
                            <label className="profile_label" htmlFor="lastName">Apellidos:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className={`profile_input ${errors.lastName ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                                disabled={!isEditable}
                                {...register('lastName', {
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: 30,
                                })}
                            />
                        </div>
                        {errors.lastName && <p className="error_message">{errors.lastName.message}</p>}

                        {/*------------------------------\\ Phone 1//-----------------------------------*/}
                        <div className="profile_elements_container">
                            <label className="profile_label" htmlFor="phone_first">Teléfono:</label>
                            <input
                                type="text"
                                id="phone_first"
                                name="phone_first"
                                className={`profile_input ${errors.phone_first ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                                disabled={!isEditable}
                                {...register('phone_first', {
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: { value: 10, message: 'Máximo 10 caracteres' },
                                })}
                            />
                        </div>
                        {errors.phone_first && <p className="error_message">{errors.phone_first.message}</p>}

                        {/*------------------------------\\ Phone 2//-----------------------------------*/}
                        <div className="profile_elements_container">
                            <label className="profile_label" htmlFor="phone_second">Teléfono adicional:</label>
                            <input
                                type="text"
                                id="phone_second"
                                name="phone_second"
                                className={`profile_input ${errors.phone_second ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                                disabled={!isEditable}
                                {...register('phone_second', {
                                    maxLength: { value: 10, message: 'Máximo 10 caracteres' },
                                })}
                            />
                        </div>
                        {errors.phone_second && <p className="error_message">{errors.phone_second.message}</p>}

                        {/*------------------------------\\ City //-----------------------------------*/}
                        <div className="profile_elements_container">
                            <label className="profile_label" htmlFor="city">Ciudad:</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                className={`profile_input ${errors.city ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                                disabled={!isEditable}
                                {...register('city', {
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: 20,
                                })}
                            />
                        </div>
                        {errors.city && <p className="error_message">{errors.city.message}</p>}

                        {/*------------------------------\\ Address //-----------------------------------*/}
                        <div className="profile_elements_container">
                            <label className="profile_label" htmlFor="address">Dirección:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className={`profile_input ${errors.address ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                                disabled={!isEditable}
                                {...register('address', {
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: 50,
                                })}
                            />
                        </div>
                        {errors.address && <p className="error_message">{errors.address.message}</p>}

                        {isEditable && (
                            <div className="captcha_container" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <HCaptcha
                                    sitekey={keyHcaptcha}
                                    onVerify={handleVerifyCaptcha}
                                    onExpire={handleExpireCaptcha}
                                    ref={captchaRef}
                                    theme={theme == 'darkTheme' ? 'dark' : 'light'}
                                />
                            </div>
                        )}

                        <div className='profile_buttons_container'>
                            <Button className="profile_button" type="button" onClick={() => setIsEditable(prev => !prev)}>
                                {isEditable ? 'Cancelar' : 'Editar'}
                            </Button>
                            {isEditable && <Button className="profile_button" type="submit">Actualizar</Button>}
                        </div>
                    </form>


                </div>
            </div>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </motion.div>
    );
};

export default Profile;
