import React, { useEffect, useRef, useState } from 'react';
import './css/Cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { accessFreeProduct, addPriceShippingStore, addStoreCartFree, deleteAllProducts, updateCartFreeQuantity } from '../store/slices/cart.slice';
import ProductItem from '../components/ProductItem';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import AddCustomer from '../components/AddCustomer';
import { Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import axios from 'axios';
import shippingOptions from '../utils/shippingOption';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Decimal from 'decimal.js';


const Cart = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const keyHcaptcha = import.meta.env.VITE_HCAPTCHA_KEY_SITE;
    const [loading, setLoading] = useState(false); // Estado de carga
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state => state.user.userData?.user);
    
    
    const token = useSelector(state => state.user.userData?.token);
    const [isCompleteInfoUser, setIscompleteInfoUser] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [selectedOptionShipping, setSelectedOptionShipping] = useState(() => {
        // Recuperar la selección de envío almacenada en localStorage o sessionStorage
        return localStorage.getItem('selectedShippingOption') || 'servientrega a domicilio';
    });


    // Obtener el carrito actual desde la tienda de Redux
    const cart = useSelector(state => state.cart.storedCart);
    const cartFree = useSelector(state => state.cart.storedCartFree)
    const quantityProductCart = cart.reduce((acc, product) => acc + product.quantity, 0);
    const priceUnit = cart.length > 0 ? Number(cart[0].priceUnit) : 0;
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

    const handleOptionChange = (event) => {
        setSelectedOptionShipping(event.target.value);
        localStorage.setItem('selectedShippingOption', event.target.value);

    };

    useEffect(() => {
        calculateShippingCost();
    }, [quantityProductCart, cartFree, selectedOptionShipping]);

    let volumetricWeightBase = parseFloat(20000 / 6000);
    let volumetricWeightBaseTolerance = parseFloat(8000 / 6000);
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
                const priceBase = 6.00;
                if ((weightTotal <= 2 && weightTotal > 0)) {
                    setIsPriceShipping(parseFloat((priceBase).toFixed(2)))
                    dispatch(addPriceShippingStore(parseFloat((priceBase).toFixed(2))))
                } else if (weightTotal > 2) {
                    setIsPriceShipping(((isWeightOffset * 0.874)) + priceBase)
                    dispatch(addPriceShippingStore((isWeightOffset * 0.874) + priceBase))
                }
            } else if (selectedOptionShipping == 'cooperativa') {
                dispatch(addPriceShippingStore(5.50))
                setIsPriceShipping(5.50)
            } else if (selectedOptionShipping == 'servientrega galapagos') {
                dispatch(addPriceShippingStore(12.32))
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
                dispatch(addPriceShippingStore(2.50))
                setIsPriceShipping(2.50)
            } else if (selectedOptionShipping == 'servientrega galapagos isabela') {
                dispatch(addPriceShippingStore(19.50))
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

    const totalToPay = new Decimal(quantityProductCart)
        .times(priceUnit)
        .plus(isPriceShipping || 0) // Asegúrate de que isPriceShipping sea un número, puedes usar || 0 para manejar valores falsy.
        .toDecimalPlaces(2)

    const total = totalToPay.toNumber(); // Convierte a número al final.

    /* ----------------  Captcha --------------------- */
    /* ------- Hcapcha solo se monta 1 vez ------------*/
    const theme = useSelector(state => state.user.theme);
    const captchaRef = useRef(null);

    const onLoad = () => {
        captchaRef.current.execute();
    }

    const validaUserData = () => {
        //destructurar  user y validar que todos los capos tengan valores
        if (user) {                       
            const { phone_first, firstName, email, dni, city, address } = user;
            if ( phone_first && firstName && email && dni && city && address) {
                return true;
            }
        }
    }

    const onSubmit = async (data) => {
        // Verificar que el usuario haya completado la información
        if (!validaUserData()) {
            Swal.fire({
                position: "center",
                icon: "info",
                title: "Debes completar la información de usuario",
                showConfirmButton: true,
            }).then(() => {
                captchaRef.current.resetCaptcha();
            });
            return;
        }

        setLoading(true);

        const dataCart = { cart, cartFree, token, userCartData: user, price_unit: priceUnit, total: total, isPriceShipping };
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

        try {

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

            // //Verification Hcaptcha
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

            // localStorage.setItem("userCartData", JSON.stringify(response.data.user)); // Considera si realmente necesitas guardar userCartData en localStorage aquí
            dispatch(deleteAllProducts());
            navigate('/');

            // Mostrar mensaje de éxito
            Swal.fire({
                position: "center",
                icon: "success",
                text: "Orden enviada con éxito",
                showConfirmButton: true,
            });


        } catch (err) {
            console.log(err);
            const info = err.response?.data?.message;


            if (err) {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "Hubo un error la procesar la solicitud",
                    text: info,
                    showConfirmButton: true
                });

            }

            if (err.response?.data?.result?.failOperation) {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "Hubo un error la procesar la solicitudoo",
                    text: info,
                    showConfirmButton: true
                });

            }

            let message
            err.response?.data?.result?.cartJoinFiltered?.forEach(product => {
                message = `${product.title} (${product.description}): Stock actual: ${product.stock} Pares\n`;
            });

            if (err.response?.data?.result?.cartJoinFiltered?.length > 0) {
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: "Información de stock agotado",
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

                        <div className={isCompleteInfoUser ? 'add_customer_info_user_container':'add_customer_info_user_container alertComplete'}>
                            <AddCustomer  isCompleteInfoUser={isCompleteInfoUser} setIscompleteInfoUser={setIscompleteInfoUser}/> 
                        </div>

                        <form
                            className="cart_detail_shipping_form"
                            action=""
                            method="post"
                            id="shipping_form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className='cart_detail_method_shipping_container'>
                                <FormControl fullWidth theme={theme}>
                                    <InputLabel id="shipping-select-label">Seleccionar método de envío</InputLabel>
                                    <Select
                                        labelId="shipping-select-label"
                                        id="shipping-select"
                                        value={selectedOptionShipping}
                                        onChange={handleOptionChange}
                                        label="Seleccionar método de envío"
                                        IconComponent={ExpandMoreIcon}
                                    >
                                        {shippingOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value} >
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
                                            <li className='cart_info_value'>$ {isPriceShipping.toFixed(2)}</li>

                                        </ul>
                                    </div>
                                </div>

                            </div>
                            <div className="cart_info_total_container">
                                <ul className='cart_info_total'>
                                    <li className='cart_info_total_text'>Total a pagar: $ {totalToPay.toNumber()}</li>
                                </ul>
                            </div>


                            {/*------------------------------\\ Buttons accions //-----------------------------------*/}
                            <div className="add_customer_buttons_container">

                                <div className={`add_customer_recaptcha`}>
                                    <HCaptcha
                                        sitekey={keyHcaptcha}
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
};

export default Cart;
