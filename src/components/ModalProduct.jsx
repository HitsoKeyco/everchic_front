
import "../components/css/ModalProduct.css";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, addProductFree } from "../store/slices/cart.slice";
import SliderImg from "./SliderImg";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import Swal from "sweetalert2";


const ModalProduct = ({ product, setIsModal }) => {

    const handleContainerClick = (e) => {
        //desactivar scroll
        e.stopPropagation();
        setIsModal(false);

    };

    const handleContentClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };

    //Agregar productos al cart
    const dispatch = useDispatch();
    const isFree = useSelector(state => state.cart.stateFreeToCart)
    const freeProducts = useSelector(state => state.cart.quantityProductsFree)
    const cartFree = useSelector(state => state.cart.storedCartFree)
    const unitCartFree = cartFree ? cartFree.reduce((acc, productFree) => acc + productFree.quantity, 0) : 0;
    const navigate = useNavigate()
    const handleBuy = () => {
        if (product.stock > 0) {
            if (!isFree) {
                dispatch(addProduct({
                    productId: product.id,
                    price: product.sell_price,
                    productName: product.collection.name,
                    stock: product.stock,
                    category: product.category.name,
                    tittle: product.tittle,
                    weight: product.weight,
                    size: product.size.size,
                    image: {
                        url: product.productImgs && product.productImgs.length > 0 ? product.productImgs[0].url_medium : null,
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
                            url: product.productImgs && product.productImgs.length > 0 ? product.productImgs[0].url_medium : null,
                            alt: product.title
                        }
                    }));

                    navigate("/cart");

                }
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No hay stock disponible',
                confirmButtonText: 'Aceptar',
            })
        }
    }

    return (
        <>
            <Dialog open={handleContainerClick} onClose={handleContainerClick} fullWidth maxWidth="md" style={{ zIndex: 999, overflow: "hidden" }}>

                <div className="modal_product_container"
                    onTouchMove={handleContentClick}
                    onClick={handleContainerClick}
                >
                    <div className="modal_container"
                        onTouchMove={handleContentClick}
                        onClick={handleContentClick}
                    >
                        <i className='bx bx-x modal_icon_close'
                            onTouchMove={handleContentClick}
                            onClick={handleContainerClick}
                        >
                        </i>
                        {
                            <SliderImg product={product} />
                        }
                        <ul className="modal_description_ul_container">
                            <li className="modal_description_poduct_title">{product?.title}</li>
                            <li className="modal_description_poduct_description">{product?.description}</li>
                            <div className="modal_product_stock_size">
                                <li className="modal_description_poduct_size">Talla: {product.size?.size}</li>
                                {
                                    product?.stock <= 0 && <li className="modal_description_poduct_stock"> Agotado </li>                                    
                                }
                            </div>
                        </ul>
                        {
                            product?.stock > 0 ? (
                                <button className="modal_button button" onClick={handleBuy}><i className='bx bx-plus ' ></i></button>
                            ) : (
                                ''
                            )
                        }
                    </div>
                </div>

            </Dialog>
        </>
    );
};



ModalProduct.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        sell_price: PropTypes.number.isRequired,
        collection: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired,
        stock: PropTypes.number.isRequired,
        category: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired,
        tittle: PropTypes.string.isRequired,
        weight: PropTypes.number,
        size: PropTypes.shape({
            size: PropTypes.string.isRequired
        }).isRequired,
        productImgs: PropTypes.arrayOf(PropTypes.shape({
            url_medium: PropTypes.string
        })),
        title: PropTypes.string.isRequired,
        description: PropTypes.string
    }).isRequired,
    setIsModal: PropTypes.func.isRequired
};

export default ModalProduct;
