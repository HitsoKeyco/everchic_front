import React from 'react'
import './css/GalleryPage.css'
import { motion } from 'framer-motion';
import images from '../utils/images';
import Gallery from '../components/Gallery';

const GalleryPage = () => {

  
  return (
    <motion.div
      className="gallery_page_container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='gallery_container'>

        <Gallery images={images}/>

      </div>
    </motion.div>
  )
}

export default GalleryPage