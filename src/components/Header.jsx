import { useEffect, useState } from 'react';
import './css/Header.css';
import Menu from './Menu';
import Logo from '/logo/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import InfoPromo from './InfoPromo';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import navLinks from './js/header';
import { setTheme } from '../store/slices/user.slice';


const Header = () => {
  const navigate = useNavigate();

  const [isMenu, setIsMenu] = useState(false);
  const [isModalAuth, setIsModalAuth] = useState(false)


  const routes = navLinks()

  const handleModalAuth = () => {
    setIsModalAuth(true)
  }

  const handleMenu = () => {
    setIsMenu(!isMenu);
  };

  const handleCart = () => {

    navigate("/carrito");
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


  // tema   
  const dispatch = useDispatch();
  const userTheme = useSelector(state => state.user.theme)


  useEffect(() => {
    // Configura el tema inicial basado en la preferencia almacenada
    const getTheme = localStorage.getItem('theme') || 'darkTheme';
    if (getTheme !== userTheme) {
      dispatch(setTheme(getTheme));
    }

    // Agrega o elimina la clase 'darkTheme' en función del tema del usuario
    if (userTheme === 'darkTheme') {
      document.body.classList.add('darkTheme');
      document.body.classList.remove('lightTheme');

    } else {
      document.body.classList.remove('darkTheme');
      document.body.classList.add('lightTheme');
    }
  }, [userTheme, dispatch]);



  const handleDarkMode = () => {
    const newTheme = userTheme === 'lightTheme' ? 'darkTheme' : 'lightTheme';    
    dispatch(setTheme(newTheme));
  };



  // Manejo de cantidad de producto en estado global a mostrar en cart.
  const cart = useSelector((state) => state.cart.storedCart);
  const quantity = cart.reduce((acc, product) => acc + product.quantity, 0);

  const user = useSelector((state) => state.user.data);
  const token = useSelector(state => state.user?.token);


  return (
    <>

      <div className="header_container">
        <div className="header_info_promo_container">
          {
            <InfoPromo />
          }
        </div>
        <div className='header_elements_container'>
          <div className="header_info_enterprise">
            <p className='header_address'>Tienda de calcetines - Guayaquil</p>

            <div className="header_social_networks_container">
              {
                user?.isVerify ?
                  <p className='header_info_user'>{`Bienvenid@ ${user?.firstName}`}</p>
                  :
                  ''
              }


              <a href="http://www.instagram.com/ever_chic_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-instagram icon_header_social_network' ></i>
              </a>
              <span className='separate'>|</span>
              <a href="https://www.facebook.com/profile.php?id=1000889198919891989" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-facebook-square icon_header_social_network'></i>
              </a>
              <span className='separate'>|</span>
              <a href="https://wa.link/uibwp1" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-whatsapp icon_header_social_network'></i>
              </a>
            </div>



          </div>
          <div className='nav'>

            <ul className="nav_items_left">
              
              <li className="logo_container">
                <Link to='/' className="logo">
                  <img src={Logo} style={{ height: '50px', display: 'block', margin: '0 auto' }}></img>
                </Link>
              </li>
              
              {
                routes.map((route, index) => {
                  if (route.private && !token) return null
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
              {/* <div className='nav_item_search_container'>
              <input id="searchInput" className='nav_item_search' type="text" placeholder='Ejemplo: Bob esponja' />
              <i className='bx bx-search'></i>
            </div> */}

              <li>
                <i className="bx bx-user" onClick={handleModalAuth}></i>
              </li>

              <li className='nav_items_separate'>|</li>

              <li>
                <i
                  className={ userTheme === "darkTheme" ? "bx bx-brightness" : "bx bx-moon"}
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

          {isMenu && <Menu setIsMenu={setIsMenu} />}

          {isModalAuth && <AuthModal setIsModalAuth={setIsModalAuth} />}
        </div>
      </div>

    </>
  );
};

export default Header;
