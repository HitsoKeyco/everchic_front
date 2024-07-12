import React from 'react';
import './css/NoMatch.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NoMatch = () => {
  const theme = useSelector(state => state.user.theme);
  
  return (
    <motion.div
      className="product_filter_elements_container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='noMatch_container'>
        <div className='no_match_image_container'>
          {theme === 'lightTheme' ? (
            <img className='not_found_image' src="/404/404_light.svg" alt="404 light theme" />
          ) : (
            <img className='not_found_image' src="/404/404_dark.svg" alt="404 dark theme" />
          )}
        </div>
        <button className="button not_match_button">
          <Link to='/'>Ir al home</Link>
        </button>
      </div>
    </motion.div>
  );
};

export default NoMatch;
