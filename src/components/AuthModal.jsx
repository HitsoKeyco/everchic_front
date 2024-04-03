import React, { useState } from 'react'
import Login from './Login'
import './css/AuthModal.css'
import Register from './Register'
import Recover from './Recover'

const AuthModal = ({ setIsModalAuth }) => {

    const [isModalLogin, setIsModalLogin] = useState(true)
    const [isModalRegister, setIsModalRegister] = useState(false)
    const [isModalRecover, setIsModalRecover] = useState(false)

    const handleAuthModal = () => {
        setIsModalAuth(false)
    }

    return (
        <>
            <div className="auth_modal_container">
                <div className="auth_modal_backdrop" onClick={handleAuthModal}></div>
                
                <div className={`auth_modal_login ${isModalLogin ? '':'hidden'}`}>
                    {
                        isModalLogin ? <Login setIsModalLogin={setIsModalLogin} setIsModalRegister={setIsModalRegister} setIsModalRecover={setIsModalRecover} handleAuthModal={handleAuthModal}/>
                        :''
                    }
                </div>

                <div className={`auth_modal_register ${isModalRegister ? '':'hidden'}`}>
                    {
                        isModalRegister ? <Register setIsModalLogin={setIsModalLogin} setIsModalRegister={setIsModalRegister} setIsModalRecover={setIsModalRecover} handleAuthModal={handleAuthModal}/>
                        :''
                    }
                </div>

                <div className={`auth_modal_recover ${isModalRecover ? '':'hidden'}`}>
                    {
                        isModalRecover ? <Recover setIsModalLogin={setIsModalLogin} setIsModalRegister={setIsModalRegister} setIsModalRecover={setIsModalRecover} handleAuthModal={handleAuthModal}/>
                        :''
                    }
                </div>


            </div>
        </>
    )
}

export default AuthModal