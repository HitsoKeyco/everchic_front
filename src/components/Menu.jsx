import React from 'react'
import '../components/css/Menu.css'
const Menu = ({ setIsMenu }) => {

    const handleMenu = () => {
        setIsMenu(false)
    }

    return (
        <>
            <div className='menu'>
                <ul className='menu_items_top'>
                    <li><i className='bx bx-moon' ></i></li>
                    <li><i className='bx bx-cart-alt' ></i></li>
                    <li onClick={handleMenu}><i className='bx bx-x'></i></li>
                </ul>
                <ul className='menu_items_left'>
                    <li className='menu_item_products'>Home</li>
                    <li className='menu_item_products'>Productos</li>
                </ul>
            </div>
        </>
    )
}

export default Menu