import { useEffect, useRef, useState } from 'react';
import './css/Cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { accessFreeProduct, addPriceShippingStore, addStoreCartFree, deleteAllProducts, updateCartFreeQuantity } from '../store/slices/cart.slice';
import ProductItem from '../components/ProductItem';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import AddCustomer from '../components/AddCustomer';
import { Backdrop, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import axios from 'axios';

import Decimal from 'decimal.js';
import { setUpdateUser } from '../store/slices/user.slice';



const Cart = () => {
    const { control, register, setValue, reset, clearErrors, formState: { errors }, handleSubmit, watch } = useForm();

    const apiUrl = import.meta.env.VITE_API_URL;
    const keyHcaptcha = import.meta.env.VITE_HCAPTCHA_KEY_SITE;
    const user = useSelector(state => state.user.userData?.user);
    const token = useSelector(state => state.user.userData?.token);
    const theme = useSelector(state => state.user?.theme);
    const captchaRef = useRef(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Estado del token de Hcaptcha
    const [tokenCaptcha, setTokenCaptcha] = useState("");

    // Estado de carga
    const [loading, setLoading] = useState(false);
    // Estado de la opción de envío seleccionada
    const [isShippingOptionSelected, setShippingOptionSelected] = useState();

    // Estado de las opciones de envío
    const [shippingOptions, setShippingOptions] = useState([]);



    // Obtener el carrito de la tienda
    const cart = useSelector(state => state.cart.storedCart);
    // Obtener el carrito de productos gratuitos
    const cartFree = useSelector(state => state.cart.storedCartFree)
    // Calcular la cantidad total de productos
    const quantityProductCart = cart.reduce((acc, product) => acc + product.quantity, 0);
    // Obtener el precio unitario del primer producto
    const priceUnit = cart.length > 0 ? Number(cart[0].priceUnit) : 0;
        
    // Calcular la cantidad total de productos gratuitos    
    const freeProducts = useSelector(state => state.cart.quantityProductsFree)
    // Obtener el precio de envio de la tienda
    const priceShipping = useSelector(state => state.cart.stateShippingCart);
    // Calcular la cantidad total de productos
    const quantityProductCartFree = cartFree ? cartFree.reduce((acc, productFree) => acc + productFree.quantity, 0) : 0;

    useEffect(() => {
        shippingOptionsFetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const shippingOptionsFetch = () => {
        axios.get(`${apiUrl}/shipping`)
            .then(res => {
                setShippingOptions(res.data)

                // Recuperar la selección de envío del usuario desde localStorage
                const selectionShippingUserString = localStorage.getItem('selectedShippingOption');
                const selectionShippingUser = selectionShippingUserString ? parseInt(selectionShippingUserString) : null;
                if (selectionShippingUser) {
                    setShippingOptionSelected(selectionShippingUser);
                    //Seleccion de envio recuperada del localStorage del usuario
                    setValue('shippingId', selectionShippingUser);
                }



            })
            // eslint-disable-next-line no-unused-vars
            .catch(err => {

            })
    }

    useEffect(() => {
        // Calcular el costo de envío
        if (cart.length > 0 && isShippingOptionSelected && weightTotal > 0) {            
            calculateShippingCost(isShippingOptionSelected);
        } else {
            dispatch(addPriceShippingStore(0));
        }
    }, [isShippingOptionSelected, quantityProductCart])


    // Verifica si la cantidad total de productos gratuitos está dentro del rango deseado
    const handleFreeButton = () => {
        if (freeProducts > 0 && quantityProductCartFree < freeProducts) {
            dispatch(accessFreeProduct(true));
            navigate('/products')
        } else {
            dispatch(accessFreeProduct(false));
        }
    }

    const infoFree = {
        value: true
    }

    //--------Calcula el peso total de los productos en el carrito----------------
    const weightCartTotal = cart.reduce((acc, product) => {
        // Utiliza Decimal para calcular el peso total de productos normales
        return acc.plus(new Decimal(product.weight).times(product.quantity));
    }, new Decimal(0)); // Asegúrate de comenzar con un valor Decimal

    const weightCartFreeTotal = cartFree.reduce((acc, product) => {
        // Utiliza Decimal para calcular el peso total de productos gratuitos
        return acc.plus(new Decimal(product.weight).times(product.quantity));
    }, new Decimal(0)); // Asegúrate de comenzar con un valor Decimal

    // Suma ambos pesos y redondea a dos decimales
    const weightTotal = weightCartTotal.plus(weightCartFreeTotal).toDecimalPlaces(2).toNumber(); // Convierte a número primitivo

    // Función para manejar el cambio de opción de envío
    const handleOptionChange = (event) => {
        setShippingOptionSelected(event.target.value);
        localStorage.setItem('selectedShippingOption', event.target.value);

    };



    // Función para calcular el costo de envío dinámicamente con Decimal.js
    const calculateShippingCost = (selectionShippingUser) => {

        const optionData = shippingOptions?.find(option => option.id === selectionShippingUser);

        const basePrice = new Decimal(optionData?.shipping_value); // Precio base para 1 kg
        const excessPrice = new Decimal(optionData?.extra_weight_cost); // Costo adicional por cada kg excedente
        const baseWeight = new Decimal(optionData?.min_weight); // Peso base desde donde comienza el cálculo

        const shippingSelectedString = localStorage.getItem('selectedShippingOption');
        const shippingSelected = shippingSelectedString ? parseInt(shippingSelectedString) : null;

        // Si no hay productos en el carrito o no se ha seleccionado opción de envío, retorna 0
        if (cart.length === 0 || !shippingSelected) {
            console.log('No hay productos en el carrito o no se ha seleccionado una opción de envío.');
            dispatch(addPriceShippingStore(0));
            return;
        }

        // Si existe una opción de envío seleccionada, calcula el costo de envío
        if (shippingSelected) {           

            // Calcula el costo de envío si el peso total es menor o igual a 1 kg
            if (new Decimal(weightTotal).lessThanOrEqualTo(baseWeight)) {
                dispatch(addPriceShippingStore(basePrice.toFixed(2)));
            }
            // Si el peso es mayor que 1 kg, calcula el valor adicional
            else if (new Decimal(weightTotal).greaterThan(baseWeight)) {
                const excessWeight = new Decimal(weightTotal).minus(baseWeight);
                const value = basePrice.plus(excessWeight.times(excessPrice));
                dispatch(addPriceShippingStore(value.toFixed(2)));
            }
            
        } else {
            //console.log('No se seleccionó una opción de envío válida.');
        }

    }
    


    // Calcula el total a pagar
    const totalToPay = new Decimal(quantityProductCart)
        .times(priceUnit)
        .plus(priceShipping || 0)
        .toDecimalPlaces(2)

    const total = totalToPay.toNumber();

    const onLoad = () => {
        captchaRef.current.execute();
    }

    useEffect(() => {
        // Resetea el formulario con los datos actuales del usuario cuando `user` cambia
        if (user) {
            reset({
                dni: user.dni || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone_first: user.phone_first || '',
                phone_second: user.phone_second || '',
                city: user.city || '',
                address: user.address || '',
                email: user.email || '',
            });
        }
    }, [user, reset]);

    useEffect(() => {
        const subscription = watch((data) => {
            const updatedFields = {};

            // Compara cada campo con el valor actual del usuario y añade los cambios a updatedFields
            if (data.dni !== user?.dni) updatedFields.dni = data.dni;
            if (data.firstName !== user?.firstName) updatedFields.firstName = data.firstName;
            if (data.lastName !== user?.lastName) updatedFields.lastName = data.lastName;
            if (data.phone_first !== user?.phone_first) updatedFields.phone_first = data.phone_first;
            if (data.phone_second !== user?.phone_second) updatedFields.phone_second = data.phone_second;
            if (data.email !== user?.email) updatedFields.email = data.email;
            if (data.city !== user?.city) updatedFields.city = data.city;
            if (data.address !== user?.address) updatedFields.address = data.address;

            // Solo realiza la actualización si hay cambios en updatedFields
            if (Object.keys(updatedFields).length > 0) {
                const userData = {
                    token: token, // Asegura que el token se mantenga en cada actualización
                    user: {
                        ...user,          // Mantiene todos los campos existentes de user, incluyendo id
                        ...updatedFields  // Sobrescribe solo los campos modificados
                    }
                };

                dispatch(setUpdateUser(userData));
            }
        });

        return () => subscription.unsubscribe(); // Limpieza de suscripción al desmontar
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch, user, dispatch]);

    const onSubmit = async (data) => {

        setLoading(true);

        const dataCart = { cart, cartFree, token, userCartData: data, total: total, shippingId: isShippingOptionSelected, weight: weightTotal, userId: user.id };

        if(isShippingOptionSelected === null){
            Swal.fire({
                position: "center",
                icon: "info",
                title: "Debes seleccionar un método de envío",
                showConfirmButton: true,
            }).then(() => {
                setLoading(false);
                captchaRef.current.resetCaptcha();
            });
            return;
        }
        
        // Validar que el usuario haya completado la información
        if (Object.keys(errors).length > 0) {
            Swal.fire({
                position: "center",
                icon: "info",
                title: "Debes completar la información de usuario",
                showConfirmButton: true,
            }).then(() => {
                setLoading(false);
                captchaRef.current.resetCaptcha();
            });
            return;
        }

        //Si no tiene ningun producto agregado al cart
        if (cart.length === 0) {
            setLoading(false);
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "No tienes ningún producto agregado",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                setLoading(false);
                captchaRef.current.resetCaptcha();
            });
            return;
        }



        try {
            const verifyCaptchaResponse = await axios.post(`${apiUrl}/orders/verify_captcha`, { tokenCaptcha });
            if (!verifyCaptchaResponse) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Captcha no válido",
                    showConfirmButton: true,
                    timer: 1500,
                }).then(() => {
                    setLoading(false);
                    captchaRef.current.resetCaptcha();
                });
                return
            }

            // Crear la orden
            // Realizar la solicitud para crear la orden
            await axios.post(`${apiUrl}/orders/create_order`, dataCart);


            // Limpiar localStorage y otros estados solo si la orden se creó exitosamente
            localStorage.removeItem('everchic_cart_free');
            localStorage.removeItem('everchic_cart');

            dispatch(deleteAllProducts());
            navigate('/');

            // Mostrar mensaje de éxito
            Swal.fire({
                position: "center",
                icon: "success",
                text: `Orden enviada con éxito 🎉. ${user?.isVerify ? '' : 'No olvides verificar tu cuenta !!'}`,
                showConfirmButton: true,
            }).then(() => {
                if (!user?.isVerify) {
                    dispatch(setUpdateUser({ token: null, user: {} }));
                    localStorage.removeItem('userData');
                    reset({ password: '', repeat_password: '' });
                }
            });


        } catch (err) {

            let message

            const info = err.response?.data?.message;

            if (info) {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "¡Aviso!",
                    text: info,
                    showConfirmButton: true,
                    confirmButtonText: info.includes("debes verificar tu cuenta al correo") ? "Reenviar correo" : "Aceptar",

                    showCancelButton: info.includes("debes verificar tu cuenta al correo"),
                    cancelButtonText: "Cancelar",
                }).then((result) => {
                    //eliminar campo de contraseña


                    if (result.isConfirmed && info.includes("debes verificar tu cuenta al correo")) {
                        // Llama a la función para reenviar el correo
                        resendEmail(data.email);
                        dispatch(setUpdateUser({ token: null, user: {} }));
                        localStorage.removeItem('userData');
                        reset({ password: '', repeat_password: '' });
                    }
                });

                return;
            }


            if (err.response?.data?.result?.failOperation) {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "Hubo un error la procesar la solicitud",
                    text: info,
                    showConfirmButton: true
                });

            }


            err.response?.data?.result?.cartJoinFiltered?.forEach(product => {
                message = `${product.title} (${product.description}): Stock actual: ${product.stock} Pares\n`;
            });

            if (err.response?.data?.result?.cartJoinFiltered?.length > 0) {
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: "Producto con stock agotado",
                    text: message,
                    showConfirmButton: true
                });

                // Actualizar las cantidades en cart
                let updatedCart = cart.map(productCart => {
                    const product = err.response?.data?.result?.cartJoinFiltered?.find(p => p.productId === productCart.productId);
                    if (product) {
                        return { ...productCart, quantity: product.stock, stock: product.stock };
                    }
                    return productCart;
                }).filter(productCart => productCart.quantity > 0);

                localStorage.setItem('everchic_cart_free', JSON.stringify([]));
                dispatch(addStoreCartFree([]));
                dispatch(updateCartFreeQuantity(0))

                localStorage.setItem('everchic_cart', JSON.stringify(updatedCart));
                dispatch(addStoreCartFree(updatedCart));
            }

        } finally {
            setLoading(false); // Asegurar que se limpie el estado de carga
            captchaRef.current.resetCaptcha();
        }
    };

    const resendEmail = async (email) => {
        setLoading(true)
        try {
            const url = `${import.meta.env.VITE_API_URL}/users/resend_email`;
            const res = await axios.post(url, { email });
            if (res.data.message == "Se ha enviado un correo de verificación") {
                Swal.fire({
                    icon: 'success',
                    title: 'Correo electrónico enviado',
                    text: 'Revisa tu correo electrónico para activar tu cuenta',
                });
                setLoading(false)
            }

        } catch (err) {
            if (err.response.data.message == "Usuario no encontrado") {
                Swal.fire({
                    icon: 'error',
                    title: 'Email invalido',
                    text: 'Opps.. algo salio mal.. !!',
                });
                setLoading(false)
            }
        }
    }



    return (
        <>
            <div className='cart_container'>
                <div className="cart_promo_container">
                    <h4 className='cart_product_title'>Mi carrito</h4>
                    <p className='cart_product_offer'>[3 Pares $13] - [6 Pares $20] - [12 Pares $36] - [60 Pares $165]</p>
                </div>

                <div className='cart_product_container' >
                    <div className="cart_product_left_container">
                        {/*----------------------------------------*/}
                        <div className="cart_products_cart_buy">
                            <div className="cart_items_container">
                                {
                                    cart?.length > 0 ? (
                                        cart.map((product) => {
                                            if (product) {
                                                return <ProductItem key={product.productId} product={product} />
                                            }
                                            return null
                                        })
                                    ) : (
                                        <div className="cart_product_msj_alert">
                                            <p className='cart_product_messaje'>¡No ha agregado productos 🧦!</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        {/*----------------------------------------*/}

                        {/*----------------------------------------*/}
                        {
                            freeProducts > 0 &&

                            <div className="cart_products_free">
                                {

                                    freeProducts > 0 ?
                                        <div className="cart_free_container">
                                            <div className="cart_alert_button_free">
                                                {
                                                    (freeProducts > 0 && freeProducts > quantityProductCartFree) && (
                                                        <button
                                                            className='cart_product_free_alert button'
                                                            onClick={handleFreeButton}
                                                        >
                                                            Agregar
                                                        </button>
                                                    )
                                                }
                                                <h5 className='cart_info_unit_free'>
                                                    Productos gratis: {freeProducts}
                                                </h5>
                                            </div>
                                            <div className='cart_elemments_free_container'>
                                                {
                                                    cartFree?.length > 0 ? (
                                                        cartFree.map((product) => (
                                                            <ProductItem key={product.productId} product={product} infoFree={infoFree} />
                                                        ))
                                                    ) : (
                                                        <div className="cart_product_msj_alert">
                                                            <p className='cart_product_messaje'>¡No olvides agregar tus productos gratis 🧦!</p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        :
                                        ''
                                }
                            </div>
                        }
                    </div>

                    <div className='cart_details_info_buy_container'>
                        {/*----------------------------------------*/}
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className='add_customer_info_user_container'>
                                <AddCustomer
                                    register={register}
                                    setValue={setValue}
                                    reset={reset}
                                    clearErrors={clearErrors}
                                    watch={watch}
                                    errors={errors}
                                />
                            </div>

                            <div
                                className="cart_detail_shipping_form"
                                action=""
                                method="post"
                                id="shipping_form"
                            >
                                <div className='cart_detail_method_shipping_container'>
                                    <FormControl fullWidth>
                                        <InputLabel id="shipping-select-label">Seleccionar método de envío</InputLabel>
                                        <Controller
                                            name="shippingId"
                                            control={control}
                                            defaultValue="" // Establece el valor predeterminado
                                            rules={{ required: "Este campo es obligatorio" }} // Reglas de validación
                                            render={({ field }) => (
                                                <Select
                                                    {...field} // Propiedades del Controller
                                                    labelId="shipping-select-label"
                                                    id="shipping-select"
                                                    label="Seleccione método de envío"
                                                    onChange={(e) => {
                                                        field.onChange(e); // Actualiza el estado de react-hook-form
                                                        handleOptionChange(e); // Guarda el valor en LS
                                                    }}
                                                >
                                                    {shippingOptions.map(option => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            {option.shipping_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                        {errors.shippingId && <FormHelperText error>{errors.shippingId.message}</FormHelperText>}
                                    </FormControl>

                                </div>

                                {/*-----------------Resumen de compra-----------------------*/}
                                <div className='cart_detail_buy_container'>
                                    <div className="cart_detail_buy_title_container">
                                        <h4 className='cart_detail_title'>Resumen de Compra</h4>
                                    </div>
                                    <ul className='cart_info_message_container'>
                                        <li className='cart_info_message'>{quantityProductCart} pares{quantityProductCartFree > 0 && ` y ${quantityProductCartFree} de obsequio`}. 🧦</li>
                                        <li className='cart_info_weight'>Peso: {weightTotal} Kg</li>
                                    </ul>
                                    <div className="cart_info_buy_container">
                                        <div className="cart_info_title_container">
                                            <ul>
                                                <li className='cart_info_title'>Subtotal</li>
                                                <li className='cart_info_title'>Descuento</li>
                                                <li className='cart_info_title'>IVA 15%</li>
                                                <li className='cart_info_title'>Envío</li>
                                            </ul>
                                        </div>
                                        <div className="cart_info_title_container_$">
                                            <ul>
                                                <li className='cart_info_value'>$ {(quantityProductCart * priceUnit).toFixed(2)}</li>
                                                <li className='cart_info_value'>$ 0.00</li>
                                                <li className='cart_info_value'>$ 0.00</li>
                                                <li className='cart_info_value'>$ {priceShipping}</li>

                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {/*-----------------Resumen de compra-----------------------*/}
                                <div className="cart_info_total_container">
                                    <ul className='cart_info_total'>
                                        <li className='cart_info_total_text'>Total a pagar: $ {totalToPay.toFixed(2)}</li>
                                    </ul>
                                </div>


                                {/*------------------------------\\ Buttons accions //-----------------------------------*/}
                                <div className="add_customer_buttons_container">

                                    <div className={`add_customer_recaptcha`}>
                                        <HCaptcha
                                            sitekey={keyHcaptcha}
                                            onLoad={onLoad}
                                            onVerify={(tokenCaptcha) => setTokenCaptcha(tokenCaptcha)}
                                            ref={captchaRef}
                                            theme={theme == 'darkTheme' ? 'dark' : 'light'}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="add_customer_button button"
                                    >
                                        Enviar al vendedor
                                    </button>


                                </div>
                            </div >
                        </form >
                    </div>
                </div>
            </div>
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
    );
}

export default Cart;
