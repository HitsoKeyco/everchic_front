import React from 'react'
import '../components/css/Menu.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
const Menu = ({ setIsMenu }) => {

    const handleMenu = () => {
        setIsMenu(false)
    }


    const userLog = useSelector((state) => state.user.user)

    return (
        <>
            <div className='menu header_menu'>
                <ul className='menu_items_top'>
                    <li onClick={handleMenu}><i className='bx bx-x'></i></li>
                </ul>
                <ul className='menu_items_left'>
                    <li onClick={handleMenu}><Link className='menu_item_products' to='/'>Home</Link></li>
                    {
                        userLog?.isVerify ? <li onClick={handleMenu}><Link className='menu_item_products' to='/profile'>Mi Perfil</Link></li> : null
                    }
                    <li onClick={handleMenu}><Link className='menu_item_products' to='/products'>Productos</Link></li>
                    <li onClick={handleMenu}><Link className='menu_item_products' to='/galery'>Galeria</Link></li>
                    <li onClick={handleMenu}><Link className='menu_item_products' to='/faqs'>FAQ</Link></li>
                </ul>
            </div>
        </>
    )
}

export default Menu