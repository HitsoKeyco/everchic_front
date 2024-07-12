import React, { useState } from 'react';
import Login from './Login';
import './css/AuthModal.css';
import Register from './Register';
import Recover from './Recover';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const AuthModal = ({ setIsModalAuth }) => {
    const [isModalLogin, setIsModalLogin] = useState(true);
    const [isModalRegister, setIsModalRegister] = useState(false);
    const [isModalRecover, setIsModalRecover] = useState(false);

    const handleAuthModal = (e) => {
        e.stopPropagation();
    };

    const token = useSelector(state => state.user.user.token)


    const handleModalContentClick = () => {               
            setIsModalAuth(false);
    }



    const handleContainerClick = (e) => {        
        e.stopPropagation()

    };

    return (

        <div className="auth_modal_container" onClick={handleModalContentClick}>
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

export default AuthModal;
