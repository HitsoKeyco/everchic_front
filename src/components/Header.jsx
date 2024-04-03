import React, { useEffect, useState } from 'react';
import './css/Header.css';
import Menu from './Menu';
import CartProduct from './CartProduct';
import { useSelector } from 'react-redux';
import InfoPromo from './InfoPromo';
import { Link, NavLink } from 'react-router-dom';
import AuthModal from './AuthModal';
import navLinks from './js/header';


const Header = () => {
  const [isMenu, setIsMenu] = useState(false);
  const [isCart, setIsCart] = useState(false);
  const [isModalAuth, setIsModalAuth] = useState(false)

  const routes = navLinks()

  const handleModalAuth = () => {
    setIsModalAuth(true)
  }

  const handleMenu = () => {
    setIsMenu(!isMenu);
  };

  const handleCart = () => {
    setIsCart(!isCart);
  };

  const handleResize = () => {
    if (window.innerWidth > 1024) {
      setIsMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Manejo de cantidad de producto en estado global a mostrar en cart.
  const cart = useSelector((state) => state.cart.storedCart);
  const quantity = cart.reduce((acc, product) => acc + product.quantity, 0);

  const userLog = useSelector((state) => state.user.user)

  return (
    <>

      <div className="header_container">
        <div className="header_info_promo_container">
          {
            <InfoPromo />
          }
        </div>
        <div className="header_info_enterprise">
          <p className='header_address'>Santo Domingo de los Tsachilas</p>

          <div className="header_social_networks_container">
            {
              userLog?.firstName ?
                <p className='header_info_user'>{`Bienvenid@ ${userLog?.firstName}`}</p>
                :
                ''
            }
            <i className='bx bxl-instagram icon_header_social_network' ></i>
            <span className='separate'>|</span>
            <i className='bx bxl-facebook-square icon_header_social_network'></i>
            <span className='separate'>|</span>
            <i className='bx bxl-whatsapp icon_header_social_network'></i>
          </div>



        </div>
        <div className='nav'>

          <ul className="nav_items_left">
            <li>
              <Link to='/' className="logo">Everchic</Link>
            </li>
            {
              routes.map((route, index) => (
                <li className="" key={index}> 
                  <NavLink 
                  to={route.to}
                  className={ ({ isActive }) => isActive ?  'linkActive' : 'linkDesactive'}
                  
                  >
                  {route.text}
                  </NavLink>
                </li>
              ))
            }
          </ul>

          <ul className="nav_items_right">
            <div className='nav_item_search_container'>
              <input className='nav_item_search' type="text" placeholder='Ejemplo: Bob esponja' />
              <i className='bx bx-search'></i>
            </div>
            <li>
              <i className="bx bx-user" onClick={handleModalAuth}></i>
            </li>
            <li className='nav_items_separate'>|</li>
            <li>
              <i className="bx bx-moon"></i>
            </li>
            <li className='nav_items_separate'>|</li>
            <div className="header_cart">
              <li onClick={handleCart}>
                <i className="bx bx-cart-alt"></i>
              </li>
              <div className="quantity_products" onClick={handleCart}>
                {quantity}
              </div>
            </div>
            <li className='nav_items_separate finaly_item'>|</li>
            <li onClick={handleMenu}>
              <i className="bx bx-menu"></i>
            </li>
          </ul>

        </div>

        {isMenu && <Menu setIsMenu={setIsMenu} isCart={isCart} />}
        {<CartProduct setIsCart={setIsCart} isCart={isCart} />}
        {isModalAuth && <AuthModal setIsModalAuth={setIsModalAuth} />}
      </div>
    </>
  );
};

export default Header;
