import React from 'react'
import './css/ProductItem.css'
import { useDispatch } from 'react-redux'
import { deleteProduct, deleteProductFree, minusProduct, plusProduct } from '../store/slices/cart.slice'

const ProductItem = ({ product, infoFree}) => {
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
                    <img className='product_img_item' src={product.image?.url} alt="img_product" />
                </div>
                <div className="product_details_item_container">
                    <h4 className='product_details_item_title'>Calcetines de {product.productName}</h4>
                    <h5 className='product_details_item'>Stock: <span className='span_item'>{`${product.stock} Pares`} </span></h5>
                    <h5 className='product_details_item'>
                        Subtotal Item: <span className='span_item'>
                            {infoFree ? <span className='free_product_span'>Gratis</span> : <span>{`$${(product.quantity * product.priceUnit).toFixed(2)}`}</span>}
                        </span>
                        {
                            infoFree && <i className='bx bxs-trash trash_free' onClick={handleRemoveProductFree}></i>
                        }
                    </h5>
                    <h5 className='product_details_item'>
                        {
                            infoFree && <span>Cantidad: {product.quantity}</span>

                        }
                    </h5>
                    {!infoFree &&
                        <div className='product_details_handle'>
                            <i className='bx bx-minus product_cart_button_item_minus' onClick={handleMinusQuantity}></i>
                            <span className='product_cart_text_pair_info'>{product.quantity} Pares</span>
                            <i className='bx bx-plus product_cart_button_item_plus' onClick={handlePlusQuantity}></i>
                            <i className='bx bxs-trash' onClick={handleRemoveProduct}></i>
                        </div>
                    }

                    <h5 className='product_details_item_size'> Talla: <span className='span_item_size'>{product.size}</span></h5>
                </div>
            </div>
        </>
    )
}

export default ProductItem;
