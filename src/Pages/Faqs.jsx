import React from 'react'
import './css/Faqs.css'
import { motion } from 'framer-motion';

const Faqs = () => {
  return (
    <motion.div
      className="product_filter_elements_container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='faqs_container'>
        <h1 className='faqs_title'>Preguntas y respuestas</h1>
      </div>
    </motion.div>
  )
}

export default Faqs