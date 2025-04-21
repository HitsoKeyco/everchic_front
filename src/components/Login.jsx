import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import './css/Login.css'
import useAuth from '../hooks/useAuth'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { Backdrop, CircularProgress } from '@mui/material'
import PropTypes from 'prop-types';


const Login = ({ setIsModalLogin, setIsModalRegister, setIsModalRecover, handleModalContentClick }) => {
    const { VITE_RECAPTCHA_KEY_SITE_PROD } = import.meta.env;
    
    const reCaptchaKey = VITE_RECAPTCHA_KEY_SITE_PROD;

    const user = useSelector(state => state.user?.data);
    const theme = useSelector(state => state.theme == 'lightTheme' ? 'light' : 'dark');

    const [isShowPass, setIsShowPass] = useState(false)
    
    const [captchaToken, setCaptchaToken] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const resetCaptcha = () => {
        if (window.grecaptcha) {
            window.grecaptcha.reset();
            setCaptchaToken(null);
        }
    };

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
    const { isLoged, loginUser, logOut, loading } = useAuth()

    // espera la aprobacion del usuario logeado para cerrar el modal porq onSubmit es asincrono
    useEffect(() => {
        if (isLoged) {
            handleModalContentClick()
        }
    }, [isLoged, handleModalContentClick])

    const [isResendEmail, setIsResendEmail] = useState(false);

    const onSubmit = async (data) => {
        //capturamos el email del usuario
        const email = data.email;

        //verificamos si el captcha esta completo
        if (!captchaToken) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa el reCAPTCHA',
            });
            return;
        }

        try {
            const result = await loginUser({
                ...data,
                recaptchaToken: captchaToken,
                email: email
            });

            if (!result.success) {
                resetCaptcha();
                reset({ password: '' });
            }
        } catch (error) {
            resetCaptcha();
            reset({ password: '' });
        }
    };

    //manejador de logOut
    const onLogOut = () => {        
        logOut();
        handleModalContentClick();        
    }

    useEffect(() => {
        // Cuando el modal se abre
        setIsModalVisible(true);

        // Pequeño retraso para asegurar que el DOM esté listo
        const timer = setTimeout(() => {
            try {
                window.grecaptcha.render('g-recaptcha', {
                    sitekey: reCaptchaKey,
                    callback: (token) => {
                        setCaptchaToken(token);
                    },
                    theme: theme,
                    'expired-callback': () => {
                        setCaptchaToken(null);
                    },
                    'error-callback': () => {
                        setCaptchaToken(null);
                    },
                    tabindex: 0
                });
            } catch (error) {
                console.log('reCAPTCHA ya renderizado o error de renderizado:', error);
            }
        }, 100);

        return () => {
            setIsModalVisible(false);
            clearTimeout(timer);
        };
    }, [reCaptchaKey, theme]);

    return (
        <>
            {
                user?.email ?
                    (
                        <form
                            className="login_form_logout"
                            action=""
                            onSubmit={handleSubmit(onLogOut)}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="login-title"
                        >
                            <i className='bx bx-x login_close_modal' onClick={handleModalContentClick} role="button" aria-label="Cerrar"></i>
                            <h3 className='login_form_info_user' id="login-title"> {`Hola`}</h3>
                            <h3 className='login_form_info_user_firstName'> {`${user?.firstName}`}</h3>
                            <button className='login_button_logout button'>Cerrar sesión</button>
                        </form>
                    )
                    :
                    (
                        <form
                            method='POST'
                            className='login_form'
                            onSubmit={handleSubmit(onSubmit)}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="login-title"
                        >
                            <i className='bx bx-x login_close_modal' onClick={handleModalContentClick} role="button" aria-label="Cerrar"></i>
                            <h1 className='login_title' id="login-title">Iniciar sesión</h1>
                            <div className="login_items_container">
                                <label className="login_label" htmlFor="email" >E-mail:</label>
                                <input
                                    className={`login_input ${errors.email && 'input_error'}`}
                                    type="text" autoComplete="on"
                                    {...register('email', {
                                        required: {
                                            value: true,
                                            message: 'El campo es requerido'
                                        },
                                        pattern: {
                                            value: /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/,
                                            message: 'Formato de correo inválido.'
                                        }
                                    })}
                                />
                                {errors.email && <p className="error_message">{errors.email.message}</p>}
                            </div>
                            <div className="login_items_container">
                                <label className="login_label" htmlFor="password" >Contraseña:</label>
                                <input
                                    className={`login_input_pass ${errors.password && 'input_error'}`}
                                    type={isShowPass ? 'text' : 'password'}
                                    id='password' name='password' autoComplete="off"
                                    {...register('password', {
                                        required: {
                                            value: true,
                                            message: 'El campo es requerido'
                                        },
                                        minLength: {
                                            value: 6,
                                            message: 'La contraseña debe tener al menos 6 caracteres'
                                        }
                                    })}
                                />
                                {errors.password && <p className="error_message">{errors.password.message}</p>}

                                <div className="login_show_hidden_pass" onClick={handleShowHiddenPass}>
                                    {
                                        isShowPass ?
                                            (<i className='bx bx-show register_show_hidden_pass_icon' ></i>)
                                            :
                                            (<i className='bx bx-hide register_show_hidden_pass_icon'></i>)
                                    }
                                </div>
                            </div>

                            {isModalVisible && (
                                <div className='login_captcha_container'>
                                    <div
                                        id="g-recaptcha"
                                        className="g-recaptcha"
                                        data-sitekey={reCaptchaKey}
                                        data-theme={theme}
                                        role="presentation"
                                        aria-label="Verificación de seguridad reCAPTCHA"
                                    >
                                    </div>
                                </div>
                            )}

                            <button
                                className="login_button button"
                                type="submit"
                            >
                                Entrar
                            </button>

                            {
                                isResendEmail && (
                                    <button
                                        className="login_button button"
                                        type="submit"
                                    >
                                        Reenviar email
                                    </button>
                                )
                            }
                            <div className="login_items_links_container">
                                <span className="login_register_link" onClick={handleModalRegister}>Registrarse</span>
                                <span className="login_recover_pass_link" onClick={handleModalRecover}>¿Recuperar contraseña?</span>
                            </div>
                        </form>
                    )
            }
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




Login.propTypes = {
    setIsModalLogin: PropTypes.func.isRequired,
    setIsModalRegister: PropTypes.func.isRequired,
    setIsModalRecover: PropTypes.func.isRequired,
    handleModalContentClick: PropTypes.func.isRequired,
};



export default Login