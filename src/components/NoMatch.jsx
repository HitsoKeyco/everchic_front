import React from 'react'
import './css/NoMatch.css'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NoMatch = () => {
  return (
    <motion.div
      className="product_filter_elements_container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='noMatch_container'>
        <h1 className='noMatch_title'>¡Opps... no existe esta sección!</h1>
        <button className="noMatch_button" ><Link to='/'>Ir al home</Link></button>
      </div>
    </motion.div>
  )
}

export default NoMatch