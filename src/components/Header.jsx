import React, { useEffect, useState } from 'react';
import './css/Header.css';
import Menu from './Menu';

import { useDispatch, useSelector } from 'react-redux';
import InfoPromo from './InfoPromo';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import navLinks from './js/header';
import ChatBox from './ChatBox';
import { setTheme } from '../store/slices/user.slice';


const Header = () => {
  const navigate = useNavigate();

  const [isMenu, setIsMenu] = useState(false);
  const [isModalAuth, setIsModalAuth] = useState(false)
  const [isChatBox, setIsChatBox] = useState(false)

  const routes = navLinks()

  const handleModalAuth = () => {
    setIsModalAuth(true)
  }

  const handleMenu = () => {
    setIsMenu(!isMenu);
  };

  const handleCart = () => {

    navigate("/cart");
  };

  const handleResize = () => {
    if (window.innerWidth > 1024) {
      setIsMenu(false);
    }
  };

  const handleChatBox = (e) => {
    e.stopPropagation()
    setIsChatBox(!isChatBox)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const dispatch = useDispatch();

  const handleDarkMode = () => {
    const darkMode = document.body.classList.toggle('dark_mode');

    if (darkMode) {
      dispatch(setTheme('light')); // Cambiar al modo oscuro
    } else {
      dispatch(setTheme('dark'));
    }
  }

  // Manejo de cantidad de producto en estado global a mostrar en cart.
  const cart = useSelector((state) => state.cart.storedCart);
  const quantity = cart.reduce((acc, product) => acc + product.quantity, 0);

  const userLog = useSelector((state) => state.user.user)
  const userVerify = useSelector(state => state.user.user.isVerify)
  return (
    <>

      <div className="header_container">
        <div className="header_info_promo_container">
          {
            <InfoPromo />
          }
        </div>
        <div className="header_info_enterprise">
          <p className='header_address'>Santo Domingo de los Tsachilas, cuando compras aqui alimentas a 2 gatitos.</p>

          <div className="header_social_networks_container">
            {
              userLog?.firstName ?
                <p className='header_info_user'>{`Bienvenid@ ${userLog?.firstName}`}</p>
                :
                ''
            }


            <a href="http://www.instagram.com/ever_chic_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-instagram icon_header_social_network' ></i>
            </a>
            <span className='separate'>|</span>
            <i className='bx bxl-facebook-square icon_header_social_network'></i>
            <span className='separate'>|</span>
            <a href="http://wa.link/uibwp1" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-whatsapp icon_header_social_network'></i>
            </a>
          </div>



        </div>
        <div className='nav'>

          <ul className="nav_items_left">
            <li>
              <Link to='/' className="logo">Everchic</Link>
            </li>
            {
              routes.map((route, index) => {
                if (route.private && userVerify == null) return null
                return (
                  <li className="nav_item_link_element" key={index}>
                    <NavLink
                      to={route.to}
                      className={`
                          ${route.class === 'isActive' ? 'linkActive' : 'linkDesactive'}
                  `}
                    >
                      {route.text}
                    </NavLink>
                  </li>
                )
              })
            }
          </ul>

          <ul className="nav_items_right">
            <div className='nav_item_search_container'>
              <input id="searchInput" className='nav_item_search' type="text" placeholder='Ejemplo: Bob esponja' />
              <i className='bx bx-search'></i>
            </div>

            <li>
              <i className="bx bx-user" onClick={handleModalAuth}></i>
            </li>

            <li className='nav_items_separate'>|</li>

            <li>
              <i
                className="bx bx-moon"
                onClick={handleDarkMode}
              ></i>
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

        {isMenu && <Menu setIsMenu={setIsMenu} userLog={userLog} />}

        {isModalAuth && <AuthModal setIsModalAuth={setIsModalAuth} />}

      </div>

      <div className="nav_chat_box_container">
        <i className='bx bx-message-square-dots nav_chat_box' onClick={handleChatBox}></i>
      </div>

      {
        isChatBox && <ChatBox setIsChatBox={setIsChatBox} />
      }
    </>
  );
};

export default Header;
