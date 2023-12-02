import React, { useState } from 'react'
import './css/Header.css'
import Menu from './Menu'

const Header = () => {
  const [isMenu, setIsMenu] = useState(false)

  const handleMenu = () => {
    setIsMenu(!isMenu)
  }
  return (
    <div className="header">
      <div className='nav'>
        <ul className='nav_items_left'>
          <li className='logo'>Everchic</li>
          <li className='nav_item_products hidden'>Home</li>
          <li className='nav_item_products hidden'>productos</li>

        </ul>
        <ul className='nav_items_right'>
          <li><i className='bx bx-user hidden'></i></li>
          <li><i className='bx bx-moon' ></i></li>
          <li><i className='bx bx-cart-alt' ></i></li>
          <li onClick={handleMenu}><i className='bx bx-menu '></i></li>
        </ul>
      </div>
      {
        isMenu && <Menu setIsMenu={setIsMenu}/>
      }
    </div>

  )
}

export default Header