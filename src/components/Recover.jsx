import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import './css/Recover.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const Recover = ({ setIsModalLogin, setIsModalRegister, setIsModalRecover, handleModalContentClick }) => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [isShowPass, setIsShowPass] = useState(false)
  const navigate = useNavigate();


  const handleShowHiddenPass = () => {
    setIsShowPass(!isShowPass)
  }

  const onSubmit = (data) => {
    const apiUrl = import.meta.env.VITE_API_URL
    axios.post(`${apiUrl}/users/recover_account`, data)
      .then(res => {
        console.log(res)
        Swal.fire({
          icon: 'success',
          title: '¡Cuenta recuperada con éxito, revisa tu correo!',
          showConfirmButton: false,
          })
        
        navigate("/")
        handleModalContentClick(false)
        

      })
      .catch(err => {
        console.log(err)
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'No se pudo recuperar la cuenta, intenta de nuevo',
          showConfirmButton: false,
          })
      })
    
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
          <label className="recover_label" htmlFor="email" >E-mail:</label>
          <input className="recover_input" type="text" autoComplete="off"
            {...register('email', { required: 'Este campo es obligatorio' })}
          />
        </div>
        <div className="recover_items_button_container">
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