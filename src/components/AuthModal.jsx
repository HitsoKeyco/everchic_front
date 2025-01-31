import { useEffect, useState } from 'react';
import Login from './Login';
import './css/AuthModal.css';
import Register from './Register';
import Recover from './Recover';
import PropTypes from 'prop-types';

const AuthModal = ({ setIsModalAuth }) => {
    const [isModalLogin, setIsModalLogin] = useState(true);
    const [isModalRegister, setIsModalRegister] = useState(false);
    const [isModalRecover, setIsModalRecover] = useState(false);

    const handleAuthModal = (e) => {
        e.stopPropagation();
    };

    const handleModalContentClick = (e) => {        
        setIsModalAuth(false);        
        document.body.classList.remove('overflow-hidden');
    }

    const handleContainerClick = (e) => {
        e.stopPropagation()

    };

    useEffect(() => {

        if(isModalRegister || isModalRecover){
            document.body.classList.add('overflow-hidden');
        }

        if(isModalLogin){
            document.body.classList.add('overflow-hidden');
        }

    }, [isModalLogin, isModalRegister, isModalRecover])

    return (

        <div className="auth_modal_container"  onClick={handleModalContentClick}>
            <div className={`auth_modal_login ${isModalLogin ? '' : 'hidden'}`} onClick={handleContainerClick}>
                {isModalLogin && (
                    <Login
                        setIsModalLogin={setIsModalLogin}
                        setIsModalRegister={setIsModalRegister}
                        setIsModalRecover={setIsModalRecover}
                        handleModalContentClick={handleModalContentClick}
                    />
                )}
            </div>

            <div className={`auth_modal_register ${isModalRegister ? '' : 'hidden'}`} onClick={handleAuthModal}>
                {isModalRegister && (
                    <Register
                        setIsModalLogin={setIsModalLogin}
                        setIsModalRegister={setIsModalRegister}
                        setIsModalRecover={setIsModalRecover}
                        handleModalContentClick={handleModalContentClick}
                    />
                )}
            </div>

            <div className={`auth_modal_recover ${isModalRecover ? '' : 'hidden'}`} onClick={handleAuthModal}>
                {isModalRecover && (
                    <Recover
                        setIsModalLogin={setIsModalLogin}
                        setIsModalRegister={setIsModalRegister}
                        setIsModalRecover={setIsModalRecover}
                        handleModalContentClick={handleModalContentClick}
                        setIsModalAuth={setIsModalAuth}

                    />
                )}
            </div>
        </div>

    );
};



AuthModal.propTypes = {
    setIsModalAuth: PropTypes.func.isRequired,
};

export default AuthModal;
