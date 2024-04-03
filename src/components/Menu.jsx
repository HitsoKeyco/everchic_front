import React from 'react'
import '../components/css/Menu.css'
import { Link } from 'react-router-dom'
const Menu = ({ setIsMenu, isCart }) => {

    const handleMenu = () => {
        setIsMenu(false)
    }

    return (
        <>
            <div className='menu header_menu'>
                <ul className='menu_items_top'>
                    <li><i className='bx bx-moon' ></i></li>
                    <li><i className='bx bx-cart-alt' ></i></li>
                    <li onClick={handleMenu}><i className='bx bx-x'></i></li>
                </ul>
                <ul className='menu_items_left'>
                <li className="menu_item_products" onClick={handleMenu}><Link to='/'>Home</Link></li>
                <li className="menu_item_products" onClick={handleMenu}><Link to='/products'>Productos</Link></li>
                <li className="menu_item_products" onClick={handleMenu}><Link to='/tracking'>Pedidos</Link></li>
                <li className="menu_item_products" onClick={handleMenu}><Link to='/galery'>Galeria</Link></li>
                <li className="menu_item_products" onClick={handleMenu}><Link to='/faqs'>FAQ</Link></li>
                </ul>
            </div>
        </>
    )
}

export default Menu