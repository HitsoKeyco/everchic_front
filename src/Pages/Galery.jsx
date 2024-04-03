import React from 'react'
import './css/Galery.css'
import { motion } from 'framer-motion';

const Galery = () => {
  return (
    <motion.div
      className="product_filter_elements_container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='galery_container'>
        <h1 className='galery_title'>Galeria de fotos</h1>
      </div>
    </motion.div>
  )
}

export default Galery