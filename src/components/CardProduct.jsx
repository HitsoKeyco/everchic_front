import React, { useEffect, useRef, useState } from 'react';
import '../components/css/CardProduct.css';
import ModalProduct from './ModalProduct';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, addProductFree } from '../store/slices/cart.slice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-medium-image-zoom/dist/styles.css'
import LazyLoad from 'react-lazyload';






const CardProduct = ({ product, isLike, updateLikeProducts, isSlider }) => {

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
    const navigate = useNavigate()
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
                    weight: product.weight,
                    image: {
                        url: product.productImgs && product.productImgs.length > 0 ? product.productImgs[0].url_small : null,
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
                        weight: product.weight,
                        category: product.category.name,
                        tittle: product.tittle,
                        size: product.size.size,
                        image: {
                            url: product.productImgs && product.productImgs.length > 0 ? product.productImgs[0].url_small : null,
                            alt: product.title
                        }
                    }));


                    navigate("/cart");

                }
            }
        };
    }
    const cart = useSelector(state => state.cart.storedCart)
    const priceUnit = cart && cart.length > 0 ? cart[0].priceUnit.toFixed(2) : '5.00';

    const [islikeProduct, setIslikeProduct] = useState()

    const like = isLike?.find(like => like.productId === product.id) || null;
    const userId = useSelector(state => state.user?.user?.id) || null;


    const handleLikeProduct = (e) => {
        e.stopPropagation();
        const urlApi = import.meta.env.VITE_API_URL;
        const data = {
            productId: product.id,
            userId: userId
        };

        if (userId) {
            // Usuario autenticado
            if (like) {
                axios.delete(`${urlApi}/users/like_product/`, { data })
                    .then(res => {
                        if (res.data) {
                            updateLikeProducts();

                        }
                    })
                    .catch(err => {
                        console.error("Error al eliminar el like:", err);
                    });
            } else {
                axios.post(`${urlApi}/users/like_product`, data)
                    .then(res => {
                        if (res.data) {
                            updateLikeProducts();
                        }
                    })
                    .catch(err => {
                        console.error("Error al agregar el like:", err);
                    });
            }


        } else {
            // Usuario no autenticado
            let likes = JSON.parse(localStorage.getItem('likes')) || [];

            if (like) {
                // Eliminar el like
                likes = likes.filter(item => item.productId !== product.id);

            } else {
                // Agregar el like
                if (!likes.some(item => item.productId === product.id)) {
                    likes.push({ productId: product.id, userId: null });
                }

            }

            localStorage.setItem('likes', JSON.stringify(likes));
            updateLikeProducts();
        }
    };

    //verificar si este producto tiene like cargarlo de local Storage con useEffect
    useEffect(() => {
        const likes = JSON.parse(localStorage.getItem('likes')) || [];
        if (likes.some(item => item.productId === product.id)) {
            updateLikeProducts();
        }
    }, [])


    return (
        <>
            <div ref={cardProduct}
                className={`card_product_container ${isFree ? 'gold' : ''} ${isSlider && 'is_slider'}`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onClick={handdleModal}>

                <div className="card_container_img">
                    <i className={`bx bxs-heart ${like ? 'heart-fill' : ''}`} onClick={handleLikeProduct}></i>
                    <p className='card_product_size'> Talla {product.size?.size}</p>


                    <LazyLoad height={200} weight={200} effect="blur">

                                <img className='card_product_img' src={product?.productImgs[0] && product?.productImgs[0]?.url_small} alt="image" />

                    </LazyLoad>

                </div>

                <div className="card_product_body">
                    <div className="card_title_category">
                        <p className='card_product_name'>{product.title}</p>
                        <p className='card_product_price'>{isFree ? 'Free' : `$ ${priceUnit}`}</p>
                    </div>
                    <div className='card_product_by_container'>
                        {
                            product.stock == 0 ?
                                (
                                    <div className="card_product_stock">
                                        <span className='card_product_text_sold_out'>Agotado</span>
                                    </div>
                                )
                                :
                                (
                                    <button
                                        className='card_product_button_cart button'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBuy()
                                        }}
                                    >
                                        <i className='bx bx-plus card_button_plus'></i>
                                    </button>
                                )
                        }
                    </div>
                </div>

            </div>
            {isModal && <ModalProduct product={product} setIsModal={setIsModal} />}
        </>
    );
};

export default CardProduct;
