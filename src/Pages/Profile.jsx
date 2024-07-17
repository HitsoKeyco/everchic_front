import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import './css/Profile.css'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import getConfigAuth from '../utils/getConfigAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import Orders from '../components/Orders';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Backdrop, CircularProgress } from '@mui/material';

const Profile = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const keyHcaptcha = import.meta.env.VITE_HCAPTCHA_KEY_SITE;



  const [loading, setLoading] = useState(false); // Estado de carga
  const [isEditable, setIsEditable] = useState(false);
  const { register, setValue, handleSubmit, formState: { errors } } = useForm();

  const [tokenCaptcha, setTokenCaptcha] = useState("");
  const [error, setError] = useState(null);

  const theme = useSelector(state => state.user.theme);

  const captchaRef = useRef(null);

  const onLoad = () => {
    captchaRef.current.execute();

  }

  const user = useSelector(state => state.user.userData?.user);
  useEffect(() => {
    if (user) {
      loadDataUser();
    }
  }, [user])

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = () => {
    setIsEditable(false);
  };


  /* Actualizar datos */
  const submit = (data) => {
    console.log(data);
    setLoading(true);


    axios.post(`${apiUrl}/orders/verify_captcha`, { tokenCaptcha })
      .then(res => {
        axios.put(`${apiUrl}/users/${user.id}`, data, getConfigAuth())
          .then(res => {
            if (res) {
              Swal.fire({
                position: "center",
                icon: "success",
                text: "Actualización completada",
                showConfirmButton: false,
                timer: 1500
              });
            }
          })
          .catch(err => {
            if (err) {
              Swal.fire({
                position: "center",
                icon: "success",
                text: "Opps.. No se ha podido actualizar.. intentalo nuevamente",
                showConfirmButton: false,
                timer: 1500
              })
            }
          })
          .finally(() => {
            setLoading(false)
          })
      })
      .catch(err => {
        if (err) {
          Swal.fire({
            position: "center",
            icon: "error",
            text: "Captcha inválido",
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
      .finally(() => {
        setLoading(false)
        captchaRef.current.resetCaptcha();
        handleSaveClick();
      })


  }



  /* -------- Función cargar datos de usuario -----------*/

  const loadDataUser = () => {
    setLoading(true);
    axios.get(`${apiUrl}/users/${user.id}`, getConfigAuth())
      .then(res => {
        setValue('dni', res.data.dni);
        setValue('firstName', res.data.firstName);
        setValue('lastName', res.data.lastName);
        setValue('phone_first', res.data.phone_first);
        setValue('phone_second', res.data.phone_second);
        setValue('city', res.data.city);
        setValue('address', res.data.address);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false)
      })
  }


  return (
    <>

      <motion.div
        className="product_filter_elements_container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="profile_container">
          <div className="profile_title_container">
            <div className="profile_avatar_container">
              <img className='profile_avatar' src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${user?.firstName}`} alt="" />
            </div>
            <div className="profile_avatar_info_container">
              <h3 className='profile_title'>{user.firstName + ' ' + user.lastName}</h3>
              <p className='profile_subtitle'>{user.city}</p>
            </div>
          </div>

          <div className="profile_data_customer_container">
            <div className="profile_container_orders">
              <Orders />
            </div>

            {/*------------------------------\\ form //-----------------------------------*/}
            <form className="profile_form" onSubmit={handleSubmit(submit)}>
              {/*------------------------------\\ Title component //-----------------------------------*/}

              <h4 className='profile_title_shipping'>Datos de envío</h4>
              {/*------------------------------\\ dni //-----------------------------------*/}
              <div className='profile_elements_container'>
                <label className="profile_label" htmlFor="dni">
                  Cédula ó RUC:
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  className={`profile_input ${errors.dni ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                  disabled={!isEditable}
                  autoComplete='on'
                  {...register('dni', {
                    required: 'Este campo es obligatorio',
                    minLength: {
                      value: 10,
                    },
                    maxLength: {
                      value: 13,
                    },
                    pattern: {
                      value: /^[0-9]{10,13}$/,
                      message: 'La cédula/RUC debe ser un número entre 10 y 13 dígitos',
                    }
                  })}
                />
              </div>
              {errors.dni && <p className="error_message">{errors.dni.message}</p>}

              {/*------------------------------\\ FirstName //-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="firstName">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  autoComplete="off"
                  className={`profile_input ${errors.firstName ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                  disabled={!isEditable}
                  {...register('firstName', {
                    required: {
                      value: true,
                      message: 'Este campo es requerido',
                    },
                    maxLength: 25,
                  })}
                />
              </div>
              {errors.firstName && <p className="error_message">{errors.firstName.message}</p>}

              {/*------------------------------\\ LastName //-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="lastName">
                  Apellidos:
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`profile_input ${errors.lastName ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                  disabled={!isEditable}
                  {...register('lastName', {
                    required: 'Este campo es obligatorio'
                  })}
                />
              </div>
              {errors.lastName && <p className="error_message">{errors.lastName.message}</p>}

              {/*------------------------------\\ Phone 1//-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="phone_first">
                  Teléfono 1:
                </label>
                <input
                  type="text"
                  id="phone_first"
                  name="phone_first"
                  placeholder='09XXXXXXXX'
                  className={`profile_input ${errors.phone_first ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                  disabled={!isEditable}
                  {...register('phone_first', {
                    required: {
                      value: true,
                      message: 'Este campo es requerido',
                    },
                    pattern: {
                      value: /^0\d{9}$/,
                    },
                    minLength: 10,
                    maxLength: 10,
                  })}
                />
              </div>
              {errors.phone_first && <p className="error_message">{errors.phone_first.message}</p>}

              {/*------------------------------\\ Phone 2//-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="phone_second">
                  Teléfono 2:
                </label>
                <input
                  type="text"
                  id="phone_second"
                  name="phone_second"
                  className={`profile_input ${!isEditable ? 'disabled-input' : ''}`}
                  placeholder='Este campo es opcional'
                  disabled={!isEditable}
                  {...register('phone_second', {
                    required: {
                      value: false,
                    },
                    pattern: {
                      value: /^0\d{9}$/,
                    },
                    minLength: 10,
                    maxLength: 10,
                  })}
                />
              </div>

              {/*------------------------------\\ City //-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="city">
                  Ciudad:
                </label>
                <input
                  type="text"
                  id='city'
                  name='city'
                  className={`profile_input ${errors.city ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                  disabled={!isEditable}
                  {...register('city', {
                    required: {
                      value: true,
                      message: 'Este campo es requerido'
                    },
                  })}
                />
              </div>
              {errors.city && <p className="error_message">{errors.city.message}</p>}

              {/*------------------------------\\ Address //-----------------------------------*/}
              <div className="profile_elements_container">
                <label className="profile_label" htmlFor="address">
                  Dirección:
                </label>
                <textarea
                  id="address"
                  name="address"
                  autoComplete='on'
                  className={`profile_input ${errors.address ? 'input-error' : ''} ${!isEditable ? 'disabled-input' : ''}`}
                  disabled={!isEditable}
                  {...register('address', {
                    required: {
                      value: true,
                      message: 'Este campo es requerido'
                    },
                    maxLength: 60,
                  })}
                />
              </div>
              {errors.address && <p className="error_message">{errors.address.message}</p>}

              <div className={`add_customer_recaptcha`}>
                <HCaptcha
                  sitekey={keyHcaptcha}
                  onLoad={onLoad}
                  onVerify={(tokenCaptcha) => setTokenCaptcha(tokenCaptcha)}
                  onError={(err) => setError(err)}
                  ref={captchaRef}
                  theme={theme == 'darkTheme' ? 'dark' : 'light'}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button className='button' style={{ flex: '1' }} >Actualizar datos</button>
                <button className='button' style={{ flex: '1' }} type="button" onClick={isEditable ? handleSaveClick : handleEditClick}>
                  {isEditable ? 'Deshabilitar  edición' : 'Editar datos'}

                </button>
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
          </div>
        </div>
      </motion.div>



    </>
  )
}

export default Profile