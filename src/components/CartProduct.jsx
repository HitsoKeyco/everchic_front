import React, { useEffect, useState } from 'react';
import './css/CartProduct.css';
import { useDispatch, useSelector } from 'react-redux';
import { accessFreeProduct } from '../store/slices/cart.slice';
import ProductItem from './ProductItem';

const CartProduct = ({ setIsCart, isCart }) => {
  // Obtener el carrito actual desde la tienda de Redux
  const cart = useSelector(state => state.cart.storedCart);
  const quantity = cart.reduce((acc, product) => acc + product.quantity, 0);
  const priceUnit = cart.length > 0 ? cart[0].priceUnit : 0;
  const freeProducts = useSelector(state => state.cart.quantityProductsFree)
  const cartFree = useSelector(state => state.cart.storedCartFree)
  const unitCartFree = cartFree ? cartFree.reduce((acc, productFree) => acc + productFree.quantity, 0) : 0;
  const dispatch = useDispatch()
  



  const handleFreeButton = () => {
    // Verifica si la cantidad total de productos gratuitos está dentro del rango deseado
    if (freeProducts > 0 && unitCartFree < freeProducts) {
      dispatch(accessFreeProduct(true));
      setIsCart(false)      
    } else {
      dispatch(accessFreeProduct(false));
    }
  }

  const infoFree = {
    value: true
  }



  return (
    <>
      <div className={`cart_product_container ${isCart ? 'cart_product_container_active': ''}`} >
        <i className='bx bx-x bx_cart cart_product_icon_close' onClick={() => setIsCart(false)}></i>
        {/*----------------------------------------*/}
        <div className="cart_products_cart_buy">
          <div className="promo"> [3 Pares $13] - [6 Pares $20] - [12 Pares $36] - [60 Pares $165]</div>
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
              <div className="cart_free">
                <div className="cart_alert_button_free">
                  {
                    freeProducts !== unitCartFree && (
                      <button
                        className='cart_product_free_alert'
                        onClick={handleFreeButton}
                      >
                        Agregar
                      </button>
                    )
                  }
                  <h5 className='cart_info_unit_free'>Gratis: {freeProducts}</h5>
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
        {/*----------------------------------------*/}

        {/*----------------------------------------*/}
        <div className="cart_product_details_buy_container">
          <h5 className='cart_product_info'>Llevas {quantity} pares{ unitCartFree > 0 && ` y ${ unitCartFree } de obsequio`  }.</h5>
          <h5 className='cart_product_info'>Subtotal: $ {(quantity * priceUnit).toFixed(2)}</h5>
          <h5 className='cart_product_info'>Total: $ {((quantity) * priceUnit).toFixed(2)}</h5>
          <div className="cart_product_details_buy">
            <button className='button_buy_cart_product'>Siguiente</button>
          </div>
        </div>
        {/*----------------------------------------*/}

      </div>

    </>
  );
};

export default CartProduct;
