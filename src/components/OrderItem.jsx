
import PropTypes from 'prop-types';
import './css/OrderItem.css';

const OrderItem = ({ product, productData }) => {
    if (!product || !productData) return null;

    const { price_unit, quantity } = product;
    const { productImgs, title, size } = productData;
    const total = parseFloat(price_unit * quantity).toFixed(2);

    return (
        <div className="order_item_product_container">
            <div className="order_item_product_image_container">
                <img src={productImgs[0]?.url_small} alt={title} className="order_item_product_image" />
            </div>
            <div className="order_item_product_body">
                <ul className='order_item_product_ul'>
                    <li className='order_item_product_title'>{title}</li>
                    <li className='order_item_product_quantity'>Cantidad: {quantity}</li>
                    <li className='order_item_product_size'>Talla: {size.size}</li>
                    <li className='order_item_product_subtotal'>Subtotal: ${total}</li>
                </ul>
            </div>
        </div>
    );
};

OrderItem.propTypes = {
    product: PropTypes.shape({
        price_unit: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
    }).isRequired,
    productData: PropTypes.shape({
        productImgs: PropTypes.arrayOf(PropTypes.shape({
            url_small: PropTypes.string,
        })).isRequired,
        title: PropTypes.string,
        size: PropTypes.shape({
            size: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default OrderItem;