import React, { useEffect, useRef, useState } from 'react';
import './css/Cart.css';
import { useDispatch, useSelector } from 'react-redux';

import { accessFreeProduct, addPriceShippingStore, deleteAllProducts } from '../store/slices/cart.slice';
import ProductItem from '../components/ProductItem';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import AddCustomer from '../components/AddCustomer';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import getConfigAuth from '../utils/getConfigAuth';
import axios from 'axios';
import shippingOptions from '../utils/shippingOption';
import validationAfterBuy from '../utils/validationAfterBuy';



const Cart = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()

    const [selectedOptionShipping, setSelectedOptionShipping] = useState(() => {
        // Recuperar la selección de envío almacenada en localStorage o sessionStorage
        return localStorage.getItem('selectedShippingOption') || 'servientrega a domicilio';
    });

    // Obtener el carrito actual desde la tienda de Redux
    const cart = useSelector(state => state.cart.storedCart);
    const cartFree = useSelector(state => state.cart.storedCartFree)
    const quantityProductCart = cart.reduce((acc, product) => acc + product.quantity, 0);
    const priceUnit = cart.length > 0 ? cart[0].priceUnit : 0;
    const freeProducts = useSelector(state => state.cart.quantityProductsFree)
    const quantityProductCartFree = cartFree ? cartFree.reduce((acc, productFree) => acc + productFree.quantity, 0) : 0;
    const quantityProducts = quantityProductCart + quantityProductCartFree;

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
    /* ---------------- Hcaptcha ---------------*/
    const [tokenCaptcha, setTokenCaptcha] = useState("");

    const [isPriceShipping, setIsPriceShipping] = useState(0)
    const [isWeightOffset, isSetWeightOffset] = useState(0)
    const [isVolumetricProduct, setIsVolumetricProduct] = useState(0)


    const weightCartTotal = cart.reduce((acc, product) => acc + (parseFloat(product.weight) * product.quantity), 0);
    const weightCartFreeTotal = cartFree.reduce((acc, product) => acc + (parseFloat(product.weight) * product.quantity), 0);
    const weightTotal = parseFloat((weightCartTotal + weightCartFreeTotal).toFixed(2)); // Peso total en kg (decimal) 


    let volumetricWeightBase = parseFloat(20000 / 6000);
    let volumetricWeightBaseTolerance = parseFloat(8000 / 6000);

    const handleOptionChange = (event) => {
        setSelectedOptionShipping(event.target.value);
        localStorage.setItem('selectedShippingOption', event.target.value);
    };

    useEffect(() => {
        calculateShippingCost()
    }, [quantityProductCart, cartFree, isPriceShipping, selectedOptionShipping])


    const calculateShippingCost = () => {
        if (cart.length > 0) {

            if (selectedOptionShipping == 'servientrega a domicilio' || selectedOptionShipping == 'servientrega Oficina') {
                if (weightTotal > 2) {
                    const weightOffset = weightTotal - 2;
                    isSetWeightOffset(parseFloat((weightOffset.toFixed(2))));
                } else if (weightTotal <= 2) {
                    isSetWeightOffset(0)
                }

                // Factor volumétrico total (decimal)
                if (quantityProducts <= 12 && quantityProducts > 0) {
                    setIsVolumetricProduct(quantityProducts * 0.06076076388888)
                } else if (quantityProducts > 12) {
                    setIsVolumetricProduct(quantityProducts * 0.06076076388888)

                }

                if (isVolumetricProduct > volumetricWeightBase) {
                    //restamos la volumetria base y el factor volumetrico de productos para saber q factor volumetrico esta excediendo  
                    const factorVolumetricOffset = parseFloat(Math.abs(volumetricWeightBase - isVolumetricProduct));
                    const factorRepeated = Math.floor(factorVolumetricOffset / volumetricWeightBaseTolerance);

                }
                const priceBase = 6;
                if ((weightTotal <= 2 && weightTotal > 0)) {
                    setIsPriceShipping(parseFloat((priceBase).toFixed(2)))
                    dispatch(addPriceShippingStore(parseFloat((priceBase).toFixed(2))))
                } else if (weightTotal > 2) {
                    setIsPriceShipping(((isWeightOffset * 0.874)) + priceBase)
                    dispatch(addPriceShippingStore((isWeightOffset * 0.874) + priceBase))
                }
            } else if (selectedOptionShipping == 'cooperativa') {
                // dispatch(addPriceShippingStore(5.50))20000
                setIsPriceShipping(5.50)
            } else if (selectedOptionShipping == 'servientrega galapagos') {
                const basePrice = 12.32;
                const weightLimit = 2;
                const factorWeightPrice = 0.00345;
                let additionalCost = 0;

                if (weightTotal > weightLimit) {
                    const excessWeight = weightTotal - weightLimit;
                    const increments = ((parseFloat(excessWeight.toFixed(2))) * 1000) * factorWeightPrice
                    additionalCost = increments;
                }

                setIsPriceShipping(basePrice + additionalCost);

            } else if (selectedOptionShipping == 'delivery') {
                setIsPriceShipping(2.50)
                dispatch(addPriceShippingStore(2.50))
            } else if (selectedOptionShipping == 'servientrega galapagos isabela') {
                const basePrice = 19.50;
                const weightLimit = 2;
                const factorWeightPrice = 0.00547;
                let additionalCost = 0;

                if (weightTotal > weightLimit) {
                    const excessWeight = weightTotal - weightLimit;
                    const increments = ((parseFloat(excessWeight.toFixed(2))) * 1000) * factorWeightPrice
                    additionalCost = increments;
                }

                setIsPriceShipping(basePrice + additionalCost);

            } else {
                setIsPriceShipping(0)

            }

        }
    }
    const priceTotalStore = useSelector(state => state.cart.stateTotalCart)
    const priceShippingStore = useSelector(state => state.cart.stateShippingCart)
    const total = (priceTotalStore + priceShippingStore).toFixed(2)

    const user = useSelector(state => state.user) || null;
    const token = useSelector(state => state.user.token) || null;
    
    /* ----------------  Captcha --------------------- */
    /* ------- Hcapcha solo se monta 1 vez --------------*/
    const theme = useSelector(state => state.user.theme);
    const captchaRef = useRef(null);
    const [newUser, setNewUser] = useState();
    const [newDataShipping, setNewDataShipping] = useState();

    const handleNewUser = (userData) => {
        setNewUser(userData);
    };

    const handleNewDataShipping = (dataShipping) => {
        setNewDataShipping(dataShipping)
    }

    const onLoad = () => {
        captchaRef.current.execute();
    }


    const submit = () => {
        const newData = { cart, cartFree, newUser: newUser, newDataShipping: newDataShipping, price_unit: priceUnit, total: total, email: user.user.email };
        const errors = validationAfterBuy(newDataShipping);
        
        //token de Hcaptcha
        if (cart.length === 0) {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "No tienes ningun producto agregado",
                showConfirmButton: false,
                timer: 1500,

            });
        } else {
            if (Object.keys(errors).length === 0) {
                console.log('Sin error');
                axios.post(`${apiUrl}/orders/verify_captcha`, { tokenCaptcha })
                    .then(res => {
                        if (res) {
                            axios.post(`${apiUrl}/orders`, newData)
                                .then(res => {
                                    if (user.id) {
                                        axios.put(`${apiUrl}/users/${user.user.id}`, newDataShipping, getConfigAuth())
                                            .then(res => {
                                                if (res.data) {
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
                                    } else {

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
                                })
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
                    text: errors.dni || errors.firstName || errors.email || errors.password||  errors.lastName || errors.phone_1 || errors.phone_2 || errors.city || errors.address,
                    showConfirmButton: true
                });
            }
        }
    };

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
                                        cart.map((product) => (
                                            <ProductItem key={product.productId} product={product} />
                                        ))
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
                                                    freeProducts !== quantityProductCartFree && (
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
                        <div className='add_customer_info_user_container'>
                            <AddCustomer setNewDataShipping={handleNewDataShipping} />
                        </div>
                        {/* <div className='cart_register_user_container'>
                            <RegisterCart setNewUser={handleNewUser} />
                        </div> */}
                        <form
                            className="cart_detail_shipping_form"
                            action=""
                            method="post"
                            id="shipping_form"
                            onSubmit={handleSubmit(submit)}
                        >
                            <div className='cart_detail_method_shipping_container'>
                                <FormControl fullWidth error={!!errors.shippingOption}>
                                    <InputLabel id="shipping-select-label">Seleccionar método de envío</InputLabel>
                                    <Select
                                        labelId="shipping-select-label"
                                        id="shipping-select"
                                        value={selectedOptionShipping}
                                        onChange={handleOptionChange}
                                        label="Seleccionar método de envío"
                                    >
                                        {shippingOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.shippingOption && <FormHelperText>{errors.shippingOption}</FormHelperText>}
                                </FormControl>
                            </div>
                            {/*-----------------Resumen de compra-----------------------*/}
                            <div className='cart_detail_buy_container'>
                                <div className="cart_detail_buy_title_container">
                                    <h4 className='cart_detail_title'>Resumen de Compra</h4>
                                </div>
                                <ul className='cart_info_message_container'>
                                    <li className='cart_info_message'>{quantityProductCart} pares{quantityProductCartFree > 0 && ` y ${quantityProductCartFree} de obsequio`}. 🧦</li>
                                    <li className='cart_info_weight'>Peso aproximado: {weightTotal} Kg</li>
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
                                            <li className='cart_info_value'>$ {isPriceShipping.toFixed(2)}</li>

                                        </ul>
                                    </div>
                                </div>

                            </div>
                            <div className="cart_info_total_container">
                                <ul className='cart_info_total'>
                                    <li className='cart_info_total_text'>Total a pagar: $ {((quantityProductCart * priceUnit) + isPriceShipping).toFixed(2)}</li>
                                </ul>
                            </div>


                            {/*------------------------------\\ Buttons accions //-----------------------------------*/}
                            <div className="add_customer_buttons_container">

                                <div className={`add_customer_recaptcha`}>
                                    <HCaptcha
                                        sitekey="187e0876-793a-422a-b2da-d11e9eea6d2a"
                                        onLoad={onLoad}
                                        onVerify={(tokenCaptcha) => setTokenCaptcha(tokenCaptcha)}
                                        onError={(err) => setError(err)}
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
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Cart;
