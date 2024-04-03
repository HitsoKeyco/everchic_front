import React, { useEffect, useRef, useState } from 'react';
import '../components/css/CardProduct.css';
import ModalProduct from './ModalProduct';
import { useDispatch, useSelector } from 'react-redux';
import { accessFreeProduct, addProduct, addProductFree } from '../store/slices/cart.slice';

const CardProduct = ({ product }) => {

    const [isModal, setIsModal] = useState(false);
    const [isPositionInitial, setIsPositionInitial] = useState({ x: 0 })
    const [isPositionFinish, setIsPositionFinish] = useState({ x: 0 })

    const cardProduct = useRef();

    //Captura la posicion inicial
    const handleMouseDown = () => {
        const positionInitial = cardProduct.current.getBoundingClientRect();
        setIsPositionInitial({
            x: positionInitial.x
        })
    };

    //Captura la posicion final
    const handleMouseUp = () => {
        const positionFinal = cardProduct.current.getBoundingClientRect();
        setIsPositionFinish({
            x: positionFinal.x
        })
    };

    //Control modal
    const handdleModal = () => {
        const tolerance = 3;
        const positionDifference = Math.abs(isPositionFinish.x - isPositionInitial.x);
        if (positionDifference <= tolerance) {
            setIsModal(true)
        }
    }

    //Agregar productos al cart
    const dispatch = useDispatch();
    const isFree = useSelector(state => state.cart.stateFreeToCart)
    const freeProducts = useSelector(state => state.cart.quantityProductsFree)
    const cartFree = useSelector(state => state.cart.storedCartFree)
    const unitCartFree = cartFree ? cartFree.reduce((acc, productFree) => acc + productFree.quantity, 0) : 0;

    const handleBuy = () => {

        const tolerance = 3;
        const positionDifference = Math.abs(isPositionFinish.x - isPositionInitial.x);

        if (positionDifference <= tolerance) {

            if (!isFree) {                
                dispatch(addProduct({
                    productId: product.id,
                    price: product.sell_price,
                    productName: product.collection.name,
                    stock: product.stock,
                    category: product.category.name,
                    tittle: product.tittle,
                    size: product.size.size,
                    image: {
                        url: product.productImgs && product.productImgs.length > 0 ? product.productImgs[0].url : null,
                        alt: product.title
                    }
                }));
                
            } else {                
                if (!(freeProducts === unitCartFree)) {
                    dispatch(addProductFree({
                        productId: product.id,
                        price: product.sell_price,
                        productName: product.collection.name,
                        stock: product.stock,
                        category: product.category.name,
                        tittle: product.tittle,
                        size: product.size.size,
                        image: {
                            url: product.productImgs && product.productImgs.length > 0 ? product.productImgs[0].url : null,
                            alt: product.title
                        }
                    }));
                }                 
            }
        };
    }
    const cart = useSelector(state => state.cart.storedCart)
    const priceUnit = cart && cart.length > 0 ? cart[0].priceUnit.toFixed(2) : '5.00';
    return (
        <>
            <div ref={cardProduct}
                className={`card_product ${isFree ? 'gold':''}`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onClick={handdleModal}>

                <div className="card_container_img">
                    <p className='card_product_size'> Talla {product.size.size}</p>
                    <img className='card_product_img' src={product.productImgs[0]?.url} alt="" />
                </div>

                <div className="card_product_body">
                    <div className="card_title_category">
                        <p className='card_product_name'>{product.title}</p>
                        <p className='card_product_price'>{isFree  ? 'Free' : `$ ${priceUnit}`}</p>
                    </div>
                    <div className="price_size">
                    </div>
                    <button
                        className='card_product_button_cart'
                        onClick={e => {
                            e.stopPropagation();
                            handleBuy()
                        }}
                    >
                        <i className='bx bx-plus card_button_plus'></i>
                    </button>
                </div>

            </div>
            {isModal && <ModalProduct product={product} setIsModal={setIsModal} />}
        </>
    );
};

export default CardProduct;
