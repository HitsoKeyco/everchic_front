import { useState } from 'react'
import { useForm } from 'react-hook-form'
import './css/Recover.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Backdrop, CircularProgress } from '@mui/material'

const Recover = ({ setIsModalLogin, setIsModalRegister, setIsModalRecover, setIsModalAuth }) => {
  const { VITE_MODE, VITE_API_URL_DEV, VITE_API_URL_PROD } = import.meta.env;
  const apiUrl = VITE_MODE === 'development' ? VITE_API_URL_DEV : VITE_API_URL_PROD;

  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Estado de carga

  const onSubmit = (data) => {
    setLoading(true)    
    axios.post(`${apiUrl}/users/recover_account`, data)
      .then(res => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: '¡Cuenta recuperada con éxito, revisa tu correo!',
          })
        }
        setIsModalAuth(false)
        setLoading(false)
        navigate("/")
      })
      .catch(err => {
        setLoading(false)
        if (err) {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'No se pudo recuperar la cuenta o no existe, intenta de nuevo',
            showConfirmButton: false,
          })
        }
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
          <input
            className={`recover_input ${errors.email && 'input_error'}`}
            type="text"
            autoComplete="on"
            {...register('email', {
              required: {
                value: true,
                message: "Este campo es requerido.",
              },
              pattern: {
                value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
                mensaje: "Formato de correo inválido."                
              }
            })}
          />
          {errors.email && <p className="error_message">{errors.email.message}</p>}
        </div>
        <div className="recover_items_button_container">
          <button className='recover_button button'>Recuperar</button>
        </div>
        <div className="recover_items_links_container">
          <span className="recover_register_link" onClick={handleModallogin}>Iniciar Sesión</span>
          <span className="recover_recover_pass_link" onClick={handleModalRegister}>Registrarse</span>
        </div>
      </form>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

import PropTypes from 'prop-types';

Recover.propTypes = {
  setIsModalLogin: PropTypes.func.isRequired,
  setIsModalRegister: PropTypes.func.isRequired,
  setIsModalRecover: PropTypes.func.isRequired,
  handleModalContentClick: PropTypes.func,
  setIsModalAuth: PropTypes.func.isRequired,
};

export default Recover