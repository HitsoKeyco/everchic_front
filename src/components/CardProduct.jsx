import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import '../components/css/CardProduct.css';
import ModalProduct from './ModalProduct';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, addProductFree } from '../store/slices/cart.slice';
import { useNavigate } from 'react-router-dom';
import 'react-medium-image-zoom/dist/styles.css'
import LazyLoad from 'react-lazyload';
import likeService from '../utils/likeService';

const CardProduct = ({ product, isSlider, key }) => {


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
            //console.log('La posicion de diferencia es menor a la tolerancia');
            if (!isFree && product) {
                console.log('Entre a comprar');
                //console.log('No es gratis', isFree, product);
                dispatch(addProduct({
                    productId: product?.id,
                    price: product?.sell_price,
                    productName: product?.collection?.name,
                    stock: product?.stock,
                    category: product?.category?.name,
                    title: product?.title,
                    size: product?.size?.size,
                    weight: product?.weight,
                    image: {
                        url: product?.productImgs && product.productImgs.length > 0 ? product.productImgs[0].url_small : null,
                        alt: product?.title
                    }
                }));

            } else if (!(freeProducts === unitCartFree)) {
                //console.log('Si freeProducts es igual a unitCartFree', freeProducts, unitCartFree);
                dispatch(addProductFree({
                    productId: product?.id,
                    price: product?.sell_price,
                    productName: product?.collection?.name,
                    stock: product?.stock,
                    weight: product?.weight,
                    category: product?.category?.name,
                    title: product?.title,
                    size: product?.size?.size,
                    image: {
                        url: product?.productImgs && product.productImgs.length > 0 ? product.productImgs[0].url_small : null,
                        alt: product?.title
                    }
                }));

                if (freeProducts - unitCartFree == 1) {
                    navigate("/cart");
                }
            }
        }
    }




    const cart = useSelector(state => state.cart.storedCart)
    const priceUnit = cart && cart.length > 0 ? cart[0].priceUnit.toFixed(2) : '5.00';
    const userId = useSelector(state => state.user.data?.id);

    const { updateLikeProducts, getLikeProducts } = likeService()

    const [isLike, setIslike] = useState(false)
    const [love, setIslove] = useState(false)


    const handleLikeProduct = (e) => {
        e.stopPropagation();
        setIslove(true);
        setIslike(!isLike)
        fetchUpdateLike()
    }


    useEffect(() => {
        fetchGetLike();
    }, [])
    

    const fetchGetLike = async () => {
        const res = await getLikeProducts();
        const likeProductId = res.includes(product.id)
        if (likeProductId) {
            setIslove(true);
        } else {
            setIslove(false);
        }
    }



    const fetchUpdateLike = async () => {
        if (userId) {
            const res = await updateLikeProducts(product.id, userId)
            const validLike = res.includes(product.id)
            if (validLike) {
                fetchGetLike();
            } else {
                setIslove(false);
            }
        }
    }

    const [solOut, setSoldOut] = useState(false)
    const productStoreWish = cart.find(element => element.productId == product.id) || false;

    useEffect(() => {
        if (productStoreWish) {
            if (productStoreWish.quantity == productStoreWish.stock) {
                setSoldOut(true);
            } else {
                setSoldOut(false);
            }
        } else {
            setSoldOut(false); // Si el producto no está en el carrito, no está agotado
        }
    }, [productStoreWish.quantity]);




    return (
        <>
            <div ref={cardProduct}
                className={`card_product_container ${isFree ? 'gold' : ''} ${isSlider && 'is_slider'}`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onClick={handdleModal}
                key={key}>


                <div className="card_container_img">
                    <i className={`bx bxs-heart ${love ? 'heart-fill' : ''}`} onClick={handleLikeProduct}></i>
                    <p className='card_product_size'> Talla {product.size?.size}</p>


                    <LazyLoad  >
                        <img className='card_product_img' src={product?.productImgs[0] && product?.productImgs[0]?.url_small} alt="image" />
                    </LazyLoad>



                </div>

                <div className="card_product_body">
                    <div className="card_title_category">
                        <p className='card_product_name'>{product?.title}</p>
                        <p className='card_product_price'>{isFree ? 'Free' : `$ ${priceUnit}`}</p>
                    </div>
                    <div className='card_product_by_container'>
                        {

                            product.stock == 0 || solOut ?
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
                                            handleBuy();
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



CardProduct.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        sell_price: PropTypes.number,
        collection: PropTypes.shape({
            name: PropTypes.string
        }),
        stock: PropTypes.number,
        category: PropTypes.shape({
            name: PropTypes.string
        }),
        title: PropTypes.string,
        size: PropTypes.shape({
            size: PropTypes.string
        }),
        weight: PropTypes.number,
        productImgs: PropTypes.arrayOf(PropTypes.shape({
            url_small: PropTypes.string
        }))
    }).isRequired,
    isSlider: PropTypes.bool,
    key: PropTypes.number
};
export default CardProduct;
