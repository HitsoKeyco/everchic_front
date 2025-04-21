import './css/ProductItem.css'
import { useDispatch } from 'react-redux'
import { deleteProduct, deleteProductFree, minusProduct, plusProduct } from '../store/slices/cart.slice'
import PropTypes from 'prop-types';

const ProductItem = ({ product, infoFree = false }) => {
    const dispatch = useDispatch();

    const handlePlusQuantity = () => {
        dispatch(plusProduct({ productId: product.productId }));
    }

    const handleMinusQuantity = () => {
        dispatch(minusProduct({ productId: product.productId }))
    }

    const handleRemoveProduct = () => {
        dispatch(deleteProduct({ productId: product.productId }))
    }

    const handleRemoveProductFree = () => {
        dispatch(deleteProductFree({ productId: product.productId }))
    }
        
    
    return (
        <>
            <div className='product_item_container'>
                <div className="product_img_item_container">
                    <img className='product_img_item' src={product?.image?.url} alt="image" />
                </div>
                <div className="product_details_item_container">
                    <p className='product_details_item_title'>{product?.productName}</p>
                    <p className='product_details_item'>Stock: <span className='span_item'>{`${product?.stock} Pares`} </span></p>
                    <p className='product_details_item'>Talla: <span className='span_item'>{product?.size} </span></p>
                    <p className='product_details_item'>
                        Subtotal Item: <span className='span_item'>
                            {infoFree ? <span className='free_product_span'>Gratis</span> : <span className='span_item'>{`$${(product?.quantity * product?.priceUnit).toFixed(2)}`}</span>}
                        </span>

                    </p>
                    <p className='product_details_item'>
                        {
                            infoFree && <span>Cantidad: {product?.quantity}</span>
                        }
                        {
                            infoFree && <i className='bx bxs-trash trash_free' onClick={handleRemoveProductFree}></i>
                        }
                    </p>

                    {!infoFree &&
                        <div className='product_details_handle'>
                            <i className='bx bx-minus product_cart_button_item_minus' onClick={handleMinusQuantity}></i>
                            <span className='product_cart_text_pair_info'>{product?.quantity} Pares</span>
                            <i className='bx bx-plus product_cart_button_item_plus' onClick={handlePlusQuantity}></i>
                            <i className='bx bxs-trash' onClick={handleRemoveProduct}></i>
                        </div>
                    }                    
                </div>
            </div>
        </>
    )
}

ProductItem.propTypes = {
    product: PropTypes.shape({
        productId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        productName: PropTypes.string.isRequired,
        image: PropTypes.shape({
            url: PropTypes.string
        }),
        stock: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        priceUnit: PropTypes.number.isRequired,
        size: PropTypes.string.isRequired
    }).isRequired,
    infoFree: PropTypes.bool
};

export default ProductItem;
