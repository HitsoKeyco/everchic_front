import React from 'react'
import './css/Tracking.css'
import { motion } from 'framer-motion';
import ChatBox from '../components/ChatBox'

const Tracking = () => {
    return (
        <motion.div
            className="product_filter_elements_container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className='tracking_container'>
             
            </div>
        </motion.div>
    )
}

export default Tracking