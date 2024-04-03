import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import './css/Recover.css'
const Recover = ({ setIsModalLogin, setIsModalRegister, setIsModalRecover }) => {

  const { register, handleSubmit, reset, formState: { } } = useForm()
  const [isShowPass, setIsShowPass] = useState(false)
    
  const handleShowHiddenPass = () => {
      setIsShowPass(!isShowPass)
  }

  const onSubmit = (data) => {
    console.log(data);
  }

  const handleModallogin = () => {
    setIsModalRecover(false)
    setIsModalLogin(true)
  }

  const handleModalRegister = () => {
    setIsModalRecover(false)
    setIsModalRegister(true)
  }


  return (
    <>
      <form method='POST' className='recover_form' onSubmit={handleSubmit(onSubmit)}>
        <h1 className='recover_title'>Recuperar contraseña</h1>
        <div className="recover_items_container">
          <label className="recover_label" htmlFor="email" >E-mail</label>
          <input className="recover_input" type="text" autoComplete="off"
            {...register('email', { required: 'Este campo es obligatorio' })}
          />
        </div>
        <div className="recover_items_container">
          <button className='recover_button'>Recuperar</button>
        </div>
        <div className="recover_items_links_container">
          <span className="recover_register_link" onClick={handleModallogin}>Iniciar Sesión</span>
          <span className="recover_recover_pass_link" onClick={handleModalRegister}>Registrarse</span>
        </div>
      </form>
    </>
  )
}

export default Recover