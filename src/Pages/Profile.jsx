import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './css/Profile.css';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import getConfigAuth from '../utils/getConfigAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import Orders from '../components/Orders';
import { Backdrop, Box, Button, CircularProgress } from '@mui/material';
import { updateUser } from '../store/slices/user.slice';
import TextFieldElement from '../components/TextFieldElement';


const Profile = () => {
    const {
        VITE_MODE, VITE_API_URL_DEV,
        VITE_API_URL_PROD,        
        VITE_RECAPTCHA_KEY_SITE_PROD
    } = import.meta.env;

    const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;
    const reCaptchaKey = VITE_RECAPTCHA_KEY_SITE_PROD

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const { register, setValue, handleSubmit, formState: { errors } } = useForm();

    const user = useSelector(state => state.user.data);
    const theme = useSelector(state => state.user.theme);


    useEffect(() => {
        if (user) {
            setValue('dni', user?.dni);
            setValue('firstName', user?.firstName);
            setValue('lastName', user?.lastName);
            setValue('phone_first', user?.phone_first);
            setValue('phone_second', user?.phone_second);
            setValue('city', user?.city);
            setValue('address', user?.address);
            setValue('email', user?.email);
        }
    }, [user, setValue]);

    
    useEffect(() => {
        
        if (isEditable) {
            const recaptchaContainer = document.getElementById('recaptcha-container');
            if (recaptchaContainer) {
                if (window.grecaptcha) {
                    window.grecaptcha.ready(() => {
                        window.grecaptcha.render('recaptcha-container', {
                            sitekey: reCaptchaKey, // Tu clave del sitio
                            callback: onSubmitCaptcha, // Función que se ejecutará con el token generado
                        });
                    });
                } else {
                    console.error("reCAPTCHA script not loaded");
                }
            }
        }
    }, [isEditable, reCaptchaKey]);

    const submit = async (data) => {

        if (!captchaToken) {
            Swal.fire({
                position: "center",
                icon: "error",
                text: "Por favor, completa el captcha.",
                showConfirmButton: true,
            });
            return;
        }

        setLoading(true);


        try {
            const res = await axios.put(`${apiUrl}/users/${user?.id}/update_user`, { user: data, captchaToken }, getConfigAuth());
            dispatch(updateUser({ user: res.data }));

            Swal.fire({
                position: "center",
                icon: "success",
                text: "Actualización completada",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                setIsEditable(false);
            });
        } catch (err) {
            //Desbloquear el botón de submit
            setIsEditable(true);
            Swal.fire({
                position: "center",
                icon: "error",
                text: `Error: ${err.response.data.message}`,
                showConfirmButton: true,
            });

        } finally {
            setLoading(false);

            setCaptchaToken(null);
        }
    };

    const onSubmitCaptcha = (token) => {
        setCaptchaToken(token);
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
                        <h3 className='profile_title'>{user?.firstName + ' ' + user?.lastName}</h3>
                        <p className='profile_subtitle'>{user?.city}</p>
                    </div>
                </div>

                <div className="profile_data_customer_container">
                    <div className="profile_container_orders">
                        <Orders />
                    </div>

                    <form className="profile_form" onSubmit={handleSubmit(submit)}>
                        <h4 className='profile_title_shipping'>Datos de envío</h4>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextFieldElement
                                name="dni"
                                label='Cédula ó RUC:'
                                errors={errors}
                                disabled={!isEditable}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                                    maxLength: { value: 13, message: 'Máximo 13 caracteres' },
                                    pattern: {
                                        value: /^[0-9]{10,13}$/,
                                        message: 'La cédula/RUC solo debe contener números',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="firstName"
                                label='Nombres:'
                                errors={errors}
                                disabled={!isEditable}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: 'El nombre solo debe contener letras',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="lastName"
                                label='Apellidos:'
                                errors={errors}
                                disabled={!isEditable}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: 'El apellido solo debe contener letras',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="phone_first"
                                label='Teléfono:'
                                errors={errors}
                                disabled={!isEditable}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: { value: 10, message: 'Máximo 10 caracteres' },
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'El teléfono debe ser un número de 10 dígitos',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="phone_second"
                                label='Teléfono adicional:'
                                errors={errors}
                                disabled={!isEditable}
                                register={register}
                                validation={{
                                    required: { value: false, message: 'Este campo es opcional' },
                                    maxLength: { value: 10, message: 'Máximo 10 caracteres' },
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'El teléfono adicional debe ser un número de 10 dígitos',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="city"
                                label='Ciudad:'
                                errors={errors}
                                disabled={!isEditable}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: { value: 30, message: 'Máximo 30 caracteres' },
                                    pattern: {
                                        value: /^[a-zA-Z]+$/,
                                        message: 'La ciudad solo debe contener letras',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="email"
                                label='email:'
                                errors={errors}
                                disabled={true}
                                value={user?.email || ''}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: { value: 30, message: 'Máximo 30 caracteres' },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Debe ser un email válido',
                                    }
                                }}
                            />

                            <TextFieldElement
                                name="address"
                                label='Dirección:'
                                errors={errors}
                                disabled={!isEditable}
                                multiline={true}
                                register={register}
                                validation={{
                                    required: { value: true, message: 'Este campo es requerido' },
                                    maxLength: 200,
                                    pattern: {
                                        value: /^[a-zA-Z0-9\s]+$/,
                                        message: 'La dirección solo debe contener letras, números y espacios',
                                    }
                                }}
                            />

                        </Box>

                        {isEditable && (
                            <div className="captcha_container">
                                <div
                                    id="recaptcha-container"
                                    className="g-recaptcha"
                                    data-sitekey={reCaptchaKey}
                                    data-callback={onSubmitCaptcha}
                                    data-theme={theme === 'darkTheme' ? 'dark' : 'light'}
                                    data-action='submit'
                                    size='compact'
                                    data-expired-callback
                                ></div>
                            </div>
                        )}

                        <div className='profile_buttons_container'>
                            {isEditable ? (
                                <Button
                                    className="profile_button"
                                    onClick={() => setIsEditable(false)}
                                >
                                    Cancelar
                                </Button>
                            ) : (
                                <Button
                                    className="profile_button"
                                    onClick={() => setIsEditable(true)}
                                >
                                    Editar
                                </Button>
                            )}

                            {isEditable && (
                                <Button
                                    className="profile_button"
                                    type="submit"
                                >
                                    Guardar
                                </Button>
                            )}
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