import React from 'react';
import './css/OrderItem.css';

const OrderItem = ({ product, productData }) => {
    const total = parseFloat(product.price_unit * product.quantity).toFixed(2);

    return (
        <>
            {productData && (
                <div className="order_item_product_container">
                    <div className="order_item_product_image_container">
                        <img src={productData.productImgs[0]?.url_small} alt={productData.title} className="order_item_product_image" />
                    </div>
                    <div className="order_item_product_body">
                        <ul className='order_item_product_ul'>
                            <li className='order_item_product_title'>{productData.title}</li>
                            <li className='order_item_product_quantity'>Cantidad: {product.quantity}</li>
                            <li className='order_item_product_size'>Talla: {productData.size.size}</li>
                            <li className='order_item_product_subtotal'>Subtotal: {total}</li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderItem;