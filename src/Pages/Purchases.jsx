import React from 'react'
import './css/Purchases.css'
import { motion } from 'framer-motion';

const Purchases = () => {
    return (
        <motion.div
            className="product_filter_elements_container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className='purchases_container'>
                <h1 className='purchases_title'>Mis compras</h1>
            </div>
        </motion.div>
    )
}

export default Purchases