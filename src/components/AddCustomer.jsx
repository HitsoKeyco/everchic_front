import React, { useEffect, useRef, useState } from 'react'
import './css/AddCustomer.css'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { deleteAllProducts } from '../store/slices/cart.slice';
import { setUpdateDataUser } from '../store/slices/user.slice';
import getConfigAuth from '../utils/getConfigAuth';

const AddCustomer = () => {
    const { register, setValue, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const apiUrl = import.meta.env.VITE_API_URL;

    // Obtener el carrito actual desde la tienda de Redux
    const cart = useSelector(state => state.cart.storedCart);
    const quantity = cart.reduce((acc, product) => acc + product.quantity, 0);
    const priceUnit = cart.length > 0 ? cart[0].priceUnit : 0;
    const user = useSelector(state => state.user) || null;
    const token = useSelector(state => state.user.token) || null;
    
    /* ----Llenado de formulario ------*/

    /*Cargar informacion del usuario*/
    const [userInfo, setUserInfo] = useState(false)

    useEffect(() => {
        if (user.token) {
            axios.get(`${apiUrl}/users/${user.user.id}`)
                .then(res => {
                    dispatch(setUpdateDataUser(res.data))
                })
                .catch(err => console.log(err));
        }
    }, [userInfo])


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
    }, [user])


    const [tokenCaptcha, setTokenCaptcha] = useState("");
    console.log(tokenCaptcha);
    const [isCompleteCaptcha, setIsCompleteCaptcha] = useState(false)


    const priceTotalStore = useSelector(state => state.cart.stateTotalCart)
    const priceShippingStore = useSelector(state => state.cart.stateShippingCart)
    const total = (priceTotalStore + priceShippingStore).toFixed(2)

    const [isShowPass, setIsShowPass] = useState(false)
    const handleShowHiddenPass = () => {
        setIsShowPass(!isShowPass)
    }

    // Calcular el subtotal
    // El método toFixed convierte el subtotal a una cadena con dos decimales
    const subtotal = (quantity * priceUnit).toFixed(2);

    // Convertir el subtotal a decimal
    const subtotalDecimal = parseFloat(subtotal);

    const cartString = localStorage.getItem('everchic_cart');
    const cartLS = JSON.parse(cartString) || {};
    const cartFreeString = localStorage.getItem('everchic_cart_free');
    const cartFree = JSON.parse(cartFreeString) || {};
    

    const onSubmit = (data) => {
        const newData = { ...data, cart: cartLS, cartFree, price_unit: priceUnit, total: total, email: user.user.email };
        //token de Hcaptcha
        if (!token) {            
            Swal.fire({
                position: "center",
                icon: "warning",
                text: "Hay un error en el captcha, actualiza la pagina",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            if (token) {
                axios.post(`${apiUrl}/orders/verify_captcha`, { tokenCaptcha })
                    .then(res => {
                        if (res) {
                            axios.post(`${apiUrl}/orders`, newData)
                                .then(res => {
                                    if (res.data) {
                                        axios.put(`${apiUrl}/users/${user.user.id}`, data, getConfigAuth())
                                            .then(res => {
                                                if (res.data) {
                                                    setUserInfo(!userInfo)
                                                    Swal.fire({
                                                        position: "center",
                                                        icon: "success",
                                                        text: "Orden enviada con exito",
                                                        showConfirmButton: false,
                                                        timer: 1500
                                                    });
                                                    localStorage.removeItem('everchic_cart_free')
                                                    localStorage.removeItem('everchic_cart')
                                                    dispatch(deleteAllProducts())                                                    
                                                    navigate('/profile');
                                                }
                                                }
                                            )
                                            .catch(err => console.log(err))
                                    }})
                                .catch(err => {
                                    if (err) {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Oops...",
                                            text: "Algo salio mal!",
                                        });
                                    }
                                })
                        }

                    })
                    .catch(err => {
                        // Manejo de errores: mostrar un mensaje al usuario
                        if (err) {
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                text: "Error al verificar el captcha",
                                showConfirmButton: true
                            });
                        }
                    });
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    text: "Error al generar la orden",
                    showConfirmButton: true
                });
            }
        }
    };




    const handleGoToTheCart = () => {
        navigate('/cart')
    }

    /* ------- Hcapcha solo se monta 1 vez --------------*/
    const captchaRef = useRef(null);

    const onLoad = () => {
        captchaRef.current.execute();
    }

    const theme = useSelector(state => state.user.theme);

    return (
        <>
            <div className="add_customer_container">
                {/*------------------------------\\ backdrop //-----------------------------------*/}

                {/*------------------------------\\ form //-----------------------------------*/}
                <form className="add_customer_form" onSubmit={handleSubmit(onSubmit)}>
                    {/*------------------------------\\ Title component //-----------------------------------*/}
                    <h3 className='add_customer_title'>Información de envío</h3>
                    <div className='add_customer_info_shipping'>
                        {/*------------------------------\\ dni //-----------------------------------*/}
                        <div className='add_customer_elements_container'>
                            <label className="add_customer_label" htmlFor="dni">
                                Cédula ó RUC:
                            </label>
                            <input
                                type="number" // Cambiado a tipo "text" para permitir una entrada de longitud variable
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
                                        value: /^\d+$/, // Expresión regular para permitir solo números                                        
                                    }
                                })}
                            />
                        </div>

                        {/*------------------------------\\ FirstName //-----------------------------------*/}
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
                        {/*------------------------------\\ LastName //-----------------------------------*/}
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
                        {/*------------------------------\\ Phone 1//-----------------------------------*/}
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

                        {/*------------------------------\\ Phone 2//-----------------------------------*/}
                        <div className="add_customer_elements_container">
                            <label className="add_customer_label" htmlFor="phone_second">
                                Teléfono 2:
                            </label>
                            <input
                                type="number"
                                id="phone_second"
                                name="phone_second"
                                className='add_customer_input'
                                placeholder='Este campo es opcional'
                                {...register('phone_second', { pattern: { value: /^0\d{9}$/ } })}
                            />
                        </div>

                        {/*------------------------------\\ City //-----------------------------------*/}
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
                        {/*------------------------------\\ Address //-----------------------------------*/}
                        <div className="add_customer_elements_container">
                            <label className="add_customer_label" htmlFor="address">
                                Dirección:
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                autoComplete='on'
                                placeholder='Escriba su dirección y alguna referencia de su vivienda como: color, plantas, decoración. etc.'
                                className={`add_customer_textarea ${errors.address ? 'input-error' : ''}`}
                                {...register('address', { required: 'Este campo es obligatorio' })}
                            />

                        </div>
                    </div>

                    {/*------------------------------\\ Seccion de registro //-----------------------------------*/}
                    {/*------------------------------\\ Email //-----------------------------------*/}

                    {
                        !user.token &&
                        (
                            <>
                                <h1 className='add_customer_register_title'>Registro</h1>
                                <div className="add_customer_register_user_container">
                                    <div className='add_customer_elements_container'>
                                        <label className="add_customer_label" htmlFor="email">
                                            Email:
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            autoComplete='on'
                                            className={`add_customer_input ${errors.email ? 'input-error' : ''}`}
                                            {...register('email', {
                                                required: 'Este campo es obligatorio',
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                                                }
                                            })}
                                        />
                                        {errors.email && <span className="error-message">{errors.email.message}</span>}
                                    </div>



                                    <div className="add_customer_register_container_element">
                                        <label className="add_customer_label" htmlFor="password">
                                            Contraseña:
                                        </label>
                                        <input
                                            type={isShowPass ? 'text' : 'password'}
                                            id='password'
                                            name='password'
                                            className={`add_customer_input add_customer_input_paddingbx ${errors.password ? 'input-error' : ''}`}
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

                                </div>

                            </>
                        )
                    }


                    <div className={`add_customer_recaptcha`}>
                        <HCaptcha
                            sitekey="187e0876-793a-422a-b2da-d11e9eea6d2a"
                            onLoad={onLoad}
                            onVerify={(tokenCaptcha) => setTokenCaptcha(tokenCaptcha)}
                            onError={(err) => setError(err)}
                            ref={captchaRef}
                            theme={theme}
                        />
                    </div>


                    {/*------------------------------\\ Buttons accions //-----------------------------------*/}
                    <div className="add_customer_buttons_container">

                        <button
                            type="submit"
                            className="add_customer_button button"
                        >
                            Enviar al vendedor
                        </button>
                        <button
                            className="add_customer_button button"
                            onClick={handleGoToTheCart}
                        >
                            Volver al carrito
                        </button>
                    </div>


                </form >

            </div >

        </>
    )
}

export default AddCustomer