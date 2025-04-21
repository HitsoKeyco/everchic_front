import '../components/css/Menu.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types';

const Menu = ({ setIsMenu }) => {

    const handleMenu = () => {
        setIsMenu(false)
    }


    const userVerify = useSelector(state => state.user?.data.isVerify)

    return (
        <>
            <div className='menu header_menu'>
                <ul className='menu_items_top'>
                    <li onClick={handleMenu}><i className='bx bx-x'></i></li>
                </ul>
                <ul className='menu_items_left'>
                    <li onClick={handleMenu}><Link className='menu_item_products' to='/'>Home</Link></li>
                    {
                        userVerify ? <li onClick={handleMenu}><Link className='menu_item_products' to='/profile'>Mi Perfil</Link></li> : null
                    }
                    <li onClick={handleMenu}><Link className='menu_item_products' to='/productos'>Productos</Link></li>
                    {/* <li onClick={handleMenu}><Link className='menu_item_products' to='/galery'>Galeria</Link></li> */}
                    <li onClick={handleMenu}><Link className='menu_item_products' to='/faqs'>FAQ</Link></li>
                </ul>
            </div>
        </>
    )
}



Menu.propTypes = {
    setIsMenu: PropTypes.func.isRequired
};
export default Menu