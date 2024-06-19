import React, { useEffect, useState } from 'react';
import './css/Cart.css';
import { useDispatch, useSelector } from 'react-redux';

import { accessFreeProduct, addPriceShippingStore } from '../store/slices/cart.slice';
import ProductItem from '../components/ProductItem';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const Cart = () => {

    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()

    const shippingOptions = [
        { value: 'servientrega a domicilio', label: 'Servientrega a domicilio', defaultChecked: true },
        { value: 'servientrega Oficina', label: 'Servientrega Oficina', defaultChecked: false },
        { value: 'servientrega galapagos', label: 'Servientrega Galapágos', defaultChecked: false },
        { value: 'servientrega galapagos isabela', label: 'Servientrega Galapágos Isabela', defaultChecked: false },
        { value: 'cooperativa', label: 'Transporte Interprovincial', defaultChecked: false },
        { value: 'delivery', label: 'Santo Domingo de los Tsachilas (Delivery)', defaultChecked: false }
    ];

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
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleFreeButton = () => {
        // Verifica si la cantidad total de productos gratuitos está dentro del rango deseado
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



    const [isPriceShipping, setIsPriceShipping] = useState(0)
    const [isWeightOffset, isSetWeightOffset] = useState(0)
    const [isVolumetricProduct, setIsVolumetricProduct] = useState(0)
    const [isFactorVolumetricRepeat, setIsFactorVolumetricRepeat] = useState(0)

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
                    setIsFactorVolumetricRepeat(factorRepeated)
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


        const submit = (data) => {
            if (cart.length === 0) {

                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "No tienes ningun producto agregado",
                    showConfirmButton: false,
                    timer: 1500
                });

            } else {
                console.log("Gracias por tu compra");
            }
        }

        const handlePaidTransfer = () => {
            if (cart.length === 0) {

                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "No tienes ningun producto agregado",
                    showConfirmButton: false,
                    timer: 1500
                });

            } else {
                navigate('/checkout')
            }
        }



        // console.log('Peso Total Cart', weightTotal, 'kg')
        // console.log('Peso Offset', isWeightOffset, 'kg');
        // console.log('Volumetria de productos cart', isVolumetricProduct);
        // console.log('factor repeticion P.V products', isFactorVolumetricRepeat);



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
                    </div>
                    {/*----------------------------------------*/}

                    <form
                        className="cart_detail_shipping_form"
                        action=""
                        method="post"
                        id="shipping_form"
                        onSubmit={handleSubmit(submit)}
                    >
                        <div className='cart_detail_method_shipping_container'>
                            <h4 className='cart_detail_title_shipping'>Método de Envío:</h4>
                            {shippingOptions.map(option => (
                                <div className='cart_detail_radio_container' key={option.value}>
                                    <input
                                        id={option.value}
                                        name='shippingOption'
                                        type="radio"
                                        value={option.value}
                                        checked={selectedOptionShipping === option.value}
                                        onChange={handleOptionChange}
                                        className={`cart_detail_label_shipping_radio ${errors.shippingOption ? 'input-error' : ''}`}
                                    />
                                    <label className='cart_detail_label_radio' htmlFor={option.value}>
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {/*-----------------Resumen de compra-----------------------*/}
                        <div className='cart_detail_buy_container'>
                            <div className="cart_detail_buy_title_container">
                                <h4 className='cart_detail_title'>Resumen de Compra</h4>
                            </div>
                            <ul className='cart_info_message_container'>
                                <li className='cart_info_message'>{quantityProductCart} pares{quantityProductCartFree > 0 && ` y ${quantityProductCartFree} de obsequio`}. 🧦</li>
                                <li className='cart_info_weight'>Aproximado: {weightTotal} Kg</li>
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

                        <div className="cart_button_container">
                            {/* <button className='cart_button_paid'>Pagar con tarjeta</button> */}
                            <button className='cart_button_send_order button' onClick={handlePaidTransfer}>Pagar con Transferencia</button>
                        </div>

                        {/*---------------------------------------------------------*/}
                    </form>
                </div>
                </div>

            </>
        );
    };

    export default Cart;
