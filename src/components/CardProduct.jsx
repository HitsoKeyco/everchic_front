import React from 'react'
import '../components/css/CardProduct.css'
import { motion } from 'framer-motion'
const CardProduct = ({ product }) => {
    return (
        <>
            <div className="card_product">
                <img className='card_product_img' src={product?.productImgs[0].url} alt="" />
                
                <div className="card_product_body">
                    <div className="card_title_category">
                        <p className='card_product_category'>{product.category.name}</p>
                        
                    </div>
                    <div className="price_size">
                        <p className='card_product_price'>${product.sell_price}</p>
                        <p className='card_product_size'> Talla {product.size.size}</p>
                    </div>
                </div>
                <button className='card_product_button_cart'>Agregar al Carrito</button>
            </div>
        </>
    )
}

export default CardProduct