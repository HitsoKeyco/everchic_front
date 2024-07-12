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

<<<<<<< HEAD
    const handleModalContentClick = () => {               
            setIsModalAuth(false);
=======
    const handleModalContentClick = () => {        
        Swal.fire({
            title: '¿Salir del modal?',            
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, salir',
            cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    setIsModalAuth(false);
                }
            })            
>>>>>>> 60c6ebfe1fd66476f6c2777f043d9182743f1e9a
    };

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
